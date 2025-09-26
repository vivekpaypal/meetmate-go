import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Users, Zap, Code, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import meetupLogo from "@/assets/meetup-logo.png";

const Landing = () => {
  const navigate = useNavigate();

  const speakers = [
    {
      name: "Dr. Sarah Chen",
      role: "AI Research Director",
      company: "TechCorp",
      topic: "The Future of Machine Learning",
      avatar: "SC"
    },
    {
      name: "Alex Rodriguez",
      role: "Senior Software Engineer", 
      company: "StartupXYZ",
      topic: "Building Scalable Microservices",
      avatar: "AR"
    },
    {
      name: "Maya Patel",
      role: "DevOps Lead",
      company: "CloudTech",
      topic: "Container Orchestration at Scale",
      avatar: "MP"
    }
  ];

  const tracks = [
    { icon: Brain, title: "AI & Machine Learning", color: "bg-purple-500" },
    { icon: Code, title: "Software Engineering", color: "bg-blue-500" },
    { icon: Zap, title: "DevOps & Cloud", color: "bg-green-500" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={meetupLogo} alt="TechMeet Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">TechMeet 2024</h1>
              <p className="text-sm text-muted-foreground">Innovate • Connect • Inspire</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/register')}
            className="tech-gradient tech-glow"
          >
            Register Now
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 tech-gradient opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
            Limited Seats Available
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TechMeet 2024
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join the most innovative tech meetup of the year. Learn from industry leaders, 
            network with peers, and shape the future of technology.
          </p>
          
          {/* Event Details Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <CalendarDays className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Date</h3>
                <p className="text-muted-foreground">December 15, 2024</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Time</h3>
                <p className="text-muted-foreground">9:00 AM - 6:00 PM</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Venue</h3>
                <p className="text-muted-foreground">Tech Convention Center</p>
              </CardContent>
            </Card>
          </div>

          <Button 
            size="lg" 
            onClick={() => navigate('/register')}
            className="tech-gradient tech-glow text-lg px-8 py-6 h-auto"
          >
            <Users className="w-5 h-5 mr-2" />
            Reserve Your Spot
          </Button>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Event Tracks</h2>
            <p className="text-xl text-muted-foreground">Choose your learning path</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tracks.map((track, index) => (
              <Card key={index} className="bg-card border-border/50 hover:border-primary/50 transition-colors animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-full ${track.color} flex items-center justify-center mx-auto mb-4`}>
                    <track.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{track.title}</h3>
                  <p className="text-muted-foreground">Deep dive into cutting-edge topics with industry experts</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Speakers</h2>
            <p className="text-xl text-muted-foreground">Learn from the best in the industry</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {speakers.map((speaker, index) => (
              <Card key={index} className="bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-xl font-bold text-primary">
                    {speaker.avatar}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{speaker.name}</h3>
                  <p className="text-primary font-medium mb-1">{speaker.role}</p>
                  <p className="text-muted-foreground text-sm mb-3">{speaker.company}</p>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {speaker.topic}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 tech-gradient opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Us?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't miss this opportunity to connect with fellow tech enthusiasts and learn from industry leaders.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/register')}
            className="tech-gradient tech-glow text-lg px-12 py-6 h-auto"
          >
            Register for TechMeet 2024
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={meetupLogo} alt="TechMeet Logo" className="w-8 h-8" />
            <span className="font-semibold">TechMeet 2024</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 TechMeet. All rights reserved. | Questions? Contact us at hello@techmeet2024.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;