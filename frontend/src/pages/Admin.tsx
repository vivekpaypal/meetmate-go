import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Mail, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Registration {
  id: number;
  name: string;
  email: string;
  company: string;
  department: string;
  role: string;
  interested_track: string;
  newsletter: boolean;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/registrations');
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast({
        title: "Error",
        description: "Failed to load registrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrackColor = (track: string) => {
    switch (track) {
      case 'ai-ml': return 'bg-purple-100 text-purple-800';
      case 'software-engineering': return 'bg-blue-100 text-blue-800';
      case 'devops-cloud': return 'bg-green-100 text-green-800';
      case 'all': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">View all registrations</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Registrations ({registrations.length})
              </CardTitle>
              <CardDescription>
                All registered participants for TechMeet 2024
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading registrations...</div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No registrations found
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map((reg) => (
                    <Card key={reg.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">{reg.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {reg.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="h-4 w-4" />
                            {reg.company} • {reg.department} • {reg.role}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge className={getTrackColor(reg.interested_track)}>
                            {reg.interested_track.replace('-', ' ').toUpperCase()}
                          </Badge>
                          {reg.newsletter && (
                            <Badge variant="secondary">Newsletter</Badge>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {new Date(reg.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
