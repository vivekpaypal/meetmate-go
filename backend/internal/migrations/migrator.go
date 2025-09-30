package migrations

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
)

type Migration struct {
	Version int
	Name    string
	SQL     string
}

type Migrator struct {
	db *sql.DB
}

func NewMigrator(db *sql.DB) *Migrator {
	return &Migrator{db: db}
}

func (m *Migrator) RunMigrations(migrationsDir string) error {
	// Create migrations table if it doesn't exist
	if err := m.createMigrationsTable(); err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	// Get applied migrations
	appliedMigrations, err := m.getAppliedMigrations()
	if err != nil {
		return fmt.Errorf("failed to get applied migrations: %w", err)
	}

	// Load migration files
	migrations, err := m.loadMigrations(migrationsDir)
	if err != nil {
		return fmt.Errorf("failed to load migrations: %w", err)
	}

	// Apply pending migrations
	for _, migration := range migrations {
		if !m.isMigrationApplied(appliedMigrations, migration.Version) {
			if err := m.applyMigration(migration); err != nil {
				return fmt.Errorf("failed to apply migration %d: %w", migration.Version, err)
			}
			fmt.Printf("Applied migration: %s\n", migration.Name)
		}
	}

	return nil
}

func (m *Migrator) createMigrationsTable() error {
	query := `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version INTEGER PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`
	_, err := m.db.Exec(query)
	return err
}

func (m *Migrator) getAppliedMigrations() (map[int]bool, error) {
	query := "SELECT version FROM schema_migrations"
	rows, err := m.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	applied := make(map[int]bool)
	for rows.Next() {
		var version int
		if err := rows.Scan(&version); err != nil {
			return nil, err
		}
		applied[version] = true
	}

	return applied, nil
}

func (m *Migrator) loadMigrations(migrationsDir string) ([]Migration, error) {
	files, err := ioutil.ReadDir(migrationsDir)
	if err != nil {
		return nil, err
	}

	var migrations []Migration
	for _, file := range files {
		if !strings.HasSuffix(file.Name(), ".sql") {
			continue
		}

		// Parse version from filename (e.g., V1__create_table.sql -> version 1)
		parts := strings.Split(file.Name(), "__")
		if len(parts) < 2 {
			continue
		}

		versionStr := strings.TrimPrefix(parts[0], "V")
		version, err := strconv.Atoi(versionStr)
		if err != nil {
			continue
		}

		// Read SQL content
		sqlPath := filepath.Join(migrationsDir, file.Name())
		sqlContent, err := ioutil.ReadFile(sqlPath)
		if err != nil {
			return nil, fmt.Errorf("failed to read migration file %s: %w", file.Name(), err)
		}

		migrations = append(migrations, Migration{
			Version: version,
			Name:    file.Name(),
			SQL:     string(sqlContent),
		})
	}

	// Sort migrations by version
	sort.Slice(migrations, func(i, j int) bool {
		return migrations[i].Version < migrations[j].Version
	})

	return migrations, nil
}

func (m *Migrator) isMigrationApplied(appliedMigrations map[int]bool, version int) bool {
	return appliedMigrations[version]
}

func (m *Migrator) applyMigration(migration Migration) error {
	// Start transaction
	tx, err := m.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Execute migration SQL
	if _, err := tx.Exec(migration.SQL); err != nil {
		return err
	}

	// Record migration as applied
	query := "INSERT INTO schema_migrations (version, name) VALUES ($1, $2)"
	if _, err := tx.Exec(query, migration.Version, migration.Name); err != nil {
		return err
	}

	// Commit transaction
	return tx.Commit()
}
