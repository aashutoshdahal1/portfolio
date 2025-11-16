import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  LogOut, 
  Save, 
  User, 
  FileText, 
  Wrench, 
  FolderKanban, 
  Briefcase, 
  Mail,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const AdminDashboard = () => {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchPortfolioData();
  }, [navigate]);

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/portfolio`);
      const data = await response.json();
      setPortfolioData(data);
    } catch (error) {
      toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('admin_token');

    try {
      const response = await fetch(`${API_URL}/api/admin/portfolio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(portfolioData),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      toast.success('Changes saved successfully!');
      setUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    navigate('/admin/login');
  };

  const updateField = (section: string, field: string, value: any) => {
    setUnsavedChanges(true);
    setPortfolioData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateNestedField = (section: string, index: number, field: string, value: any) => {
    setUnsavedChanges(true);
    setPortfolioData((prev: any) => {
      const newData = { ...prev };
      newData[section][index] = {
        ...newData[section][index],
        [field]: value,
      };
      return newData;
    });
  };

  const addItem = (section: string, template: any) => {
    setUnsavedChanges(true);
    setPortfolioData((prev: any) => ({
      ...prev,
      [section]: [...prev[section], template],
    }));
    toast.success('Item added! Remember to save changes.');
  };

  const removeItem = (section: string, index: number) => {
    setUnsavedChanges(true);
    setPortfolioData((prev: any) => ({
      ...prev,
      [section]: prev[section].filter((_: any, i: number) => i !== index),
    }));
    toast.success('Item removed! Remember to save changes.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-white text-xl">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gradient">Admin Dashboard</h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-muted-foreground">
                    Welcome, {localStorage.getItem('admin_username')}
                  </p>
                  {lastSaved && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        Last saved: {lastSaved.toLocaleTimeString()}
                      </div>
                    </>
                  )}
                  {unsavedChanges && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1 text-xs text-yellow-500">
                        <AlertCircle className="h-3 w-3" />
                        Unsaved changes
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => window.open('/', '_blank')}
                variant="outline"
                className="glass border-2"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Site
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !unsavedChanges}
                className="bg-primary hover:bg-primary/90 shadow-lg relative overflow-hidden"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
                {unsavedChanges && (
                  <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                )}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="glass border-2 border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">

        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 glass p-1">
            <TabsTrigger value="hero" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Wrench className="h-4 w-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <FolderKanban className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Briefcase className="h-4 w-4 mr-2" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card className="p-8 glass border-2 border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <User className="h-8 w-8 text-primary" />
                    Hero Section
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Main landing page content - First impression matters!
                  </p>
                </div>
                <Badge variant="outline" className="text-primary border-primary">
                  Main Banner
                </Badge>
              </div>
              <Separator className="mb-6" />
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold">Full Name</Label>
                  <Input
                    value={portfolioData.hero.name}
                    onChange={(e) => updateField('hero', 'name', e.target.value)}
                    className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                    placeholder="Your full name"
                  />
                  <p className="text-xs text-muted-foreground">This appears as the main heading</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold">Professional Title</Label>
                  <Input
                    value={portfolioData.hero.title}
                    onChange={(e) => updateField('hero', 'title', e.target.value)}
                    className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                    placeholder="e.g., Full-Stack Developer"
                  />
                  <p className="text-xs text-muted-foreground">Your role or profession</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold">Welcome Text</Label>
                  <Input
                    value={portfolioData.hero.welcomeText}
                    onChange={(e) => updateField('hero', 'welcomeText', e.target.value)}
                    className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                    placeholder="Welcome message"
                  />
                  <p className="text-xs text-muted-foreground">Small text above your name</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold">Description</Label>
                  <Textarea
                    value={portfolioData.hero.description}
                    onChange={(e) => updateField('hero', 'description', e.target.value)}
                    rows={5}
                    className="glass border-2 border-border/50 focus:border-primary transition-all resize-none"
                    placeholder="Tell visitors about yourself..."
                  />
                  <p className="text-xs text-muted-foreground">Brief introduction about you and what you do</p>
                </div>
                <div className="space-y-4 p-4 glass rounded-lg border border-border/30">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    Social Links
                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground font-semibold">GitHub URL</Label>
                      <Input
                        value={portfolioData.hero.socialLinks.github}
                        onChange={(e) => updateField('hero', 'socialLinks', { ...portfolioData.hero.socialLinks, github: e.target.value })}
                        className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-semibold">LinkedIn URL</Label>
                      <Input
                        value={portfolioData.hero.socialLinks.linkedin}
                        onChange={(e) => updateField('hero', 'socialLinks', { ...portfolioData.hero.socialLinks, linkedin: e.target.value })}
                        className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-semibold">Email</Label>
                      <Input
                        value={portfolioData.hero.socialLinks.email}
                        onChange={(e) => updateField('hero', 'socialLinks', { ...portfolioData.hero.socialLinks, email: e.target.value })}
                        className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about">
            <Card className="p-8 glass border-2 border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    About Section
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tell your story - background, skills, and what makes you unique
                  </p>
                </div>
                <Badge variant="outline" className="text-primary border-primary">
                  Biography
                </Badge>
              </div>
              <Separator className="mb-6" />
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Biography Paragraphs</h3>
                  {portfolioData.about.paragraphs.map((paragraph: string, index: number) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-foreground font-semibold flex items-center gap-2">
                        Paragraph {index + 1}
                        <Badge variant="secondary" className="text-xs">{paragraph.length} characters</Badge>
                      </Label>
                      <Textarea
                        value={paragraph}
                        onChange={(e) => {
                          const newParagraphs = [...portfolioData.about.paragraphs];
                          newParagraphs[index] = e.target.value;
                          updateField('about', 'paragraphs', newParagraphs);
                        }}
                        rows={4}
                        className="glass border-2 border-border/50 focus:border-primary transition-all resize-none"
                        placeholder="Write a paragraph about yourself..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Skills Section */}
          <TabsContent value="skills">
            <Card className="p-8 glass border-2 border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Wrench className="h-8 w-8 text-primary" />
                    Skills Section
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Technical expertise - {portfolioData.skills.categories.length} categor{portfolioData.skills.categories.length !== 1 ? 'ies' : 'y'}
                  </p>
                </div>
                <Badge variant="outline" className="text-primary border-primary">
                  Tech Stack
                </Badge>
              </div>
              <Separator className="mb-6" />
              <div className="space-y-6">
                {portfolioData.skills.categories.map((category: any, catIndex: number) => (
                  <div key={catIndex} className="border-2 border-border/50 p-6 rounded-xl glass hover:border-primary/30 transition-all">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold flex items-center gap-2">
                          Category Name
                          <Badge variant="secondary" className="text-xs">{category.skills.length} skills</Badge>
                        </Label>
                        <Input
                          value={category.title}
                          onChange={(e) => {
                            const newCategories = [...portfolioData.skills.categories];
                            newCategories[catIndex].title = e.target.value;
                            updateField('skills', 'categories', newCategories);
                          }}
                          className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                          placeholder="e.g., Frontend, Backend, Tools"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold">Skills (comma-separated)</Label>
                        <Textarea
                          value={category.skills.join(', ')}
                          onChange={(e) => {
                            const newCategories = [...portfolioData.skills.categories];
                            newCategories[catIndex].skills = e.target.value.split(',').map((s: string) => s.trim()).filter(s => s);
                            updateField('skills', 'categories', newCategories);
                          }}
                          rows={3}
                          className="glass border-2 border-border/50 focus:border-primary transition-all resize-none"
                          placeholder="React, TypeScript, Next.js, Tailwind CSS"
                        />
                        <p className="text-xs text-muted-foreground">
                          Add skills separated by commas. Each skill will appear as a badge.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Projects Section */}
          <TabsContent value="projects">
            <Card className="p-8 glass border-2 border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <FolderKanban className="h-8 w-8 text-primary" />
                    Projects Section
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Showcase your best work - {portfolioData.projects.length} project{portfolioData.projects.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  onClick={() => addItem('projects', {
                    title: "New Project",
                    description: "Project description",
                    tech: [],
                    image: "from-blue-500 to-purple-600",
                    demoLink: "#",
                    codeLink: "#"
                  })}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
              <Separator className="mb-6" />
              <div className="space-y-6">
                {portfolioData.projects.map((project: any, index: number) => (
                  <div key={index} className="border-2 border-border/50 p-6 rounded-xl space-y-4 glass hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Project {index + 1}
                        <Badge variant="outline">{project.tech.length} technologies</Badge>
                      </h3>
                      <Button
                        onClick={() => removeItem('projects', index)}
                        variant="destructive"
                        size="sm"
                        className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-semibold">Project Title</Label>
                      <Input
                        value={project.title}
                        onChange={(e) => updateNestedField('projects', index, 'title', e.target.value)}
                        className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                        placeholder="Amazing Project Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-semibold">Description</Label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateNestedField('projects', index, 'description', e.target.value)}
                        rows={3}
                        className="glass border-2 border-border/50 focus:border-primary transition-all resize-none"
                        placeholder="Describe what this project does and its key features..."
                      />
                      <p className="text-xs text-muted-foreground">{project.description.length} characters</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold">Technologies (comma-separated)</Label>
                        <Input
                          value={project.tech.join(', ')}
                          onChange={(e) => updateNestedField('projects', index, 'tech', e.target.value.split(',').map((s: string) => s.trim()))}
                          className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold">Gradient Colors</Label>
                        <Input
                          value={project.image}
                          onChange={(e) => updateNestedField('projects', index, 'image', e.target.value)}
                          className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                          placeholder="from-blue-500 to-purple-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold">Demo Link</Label>
                        <Input
                          value={project.demoLink}
                          onChange={(e) => updateNestedField('projects', index, 'demoLink', e.target.value)}
                          className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                          placeholder="https://demo.example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold">Code Repository Link</Label>
                        <Input
                          value={project.codeLink}
                          onChange={(e) => updateNestedField('projects', index, 'codeLink', e.target.value)}
                          className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                          placeholder="https://github.com/username/repo"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Experience Section */}
          <TabsContent value="experience">
            <Card className="p-8 glass border-2 border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="h-8 w-8 text-primary" />
                    Experience Section
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your professional journey - {portfolioData.experience.length} position{portfolioData.experience.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  onClick={() => addItem('experience', {
                    year: "2024 - Present",
                    role: "New Role",
                    company: "Company Name",
                    description: "Role description"
                  })}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              <Separator className="mb-6" />
              <div className="space-y-6">
                {portfolioData.experience.map((exp: any, index: number) => (
                  <div key={index} className="border-2 border-border/50 p-6 rounded-xl space-y-4 glass hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Experience {index + 1}</h3>
                      <Button
                        onClick={() => removeItem('experience', index)}
                        variant="destructive"
                        size="sm"
                        className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold">Year Range</Label>
                        <Input
                          value={exp.year}
                          onChange={(e) => updateNestedField('experience', index, 'year', e.target.value)}
                          className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                          placeholder="2020 - 2023"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold">Role/Position</Label>
                        <Input
                          value={exp.role}
                          onChange={(e) => updateNestedField('experience', index, 'role', e.target.value)}
                          className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                          placeholder="Senior Developer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold">Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateNestedField('experience', index, 'company', e.target.value)}
                          className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                          placeholder="Tech Company Inc."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-semibold">Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateNestedField('experience', index, 'description', e.target.value)}
                        rows={3}
                        className="glass border-2 border-border/50 focus:border-primary transition-all resize-none"
                        placeholder="Describe your responsibilities and achievements..."
                      />
                      <p className="text-xs text-muted-foreground">{exp.description.length} characters</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact">
            <Card className="p-8 glass border-2 border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Mail className="h-8 w-8 text-primary" />
                    Contact Section
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    How people can reach you - Make it easy for opportunities to find you
                  </p>
                </div>
                <Badge variant="outline" className="text-primary border-primary">
                  Contact Info
                </Badge>
              </div>
              <Separator className="mb-6" />
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-foreground font-semibold">Email Address</Label>
                    <Input
                      value={portfolioData.contact.email}
                      onChange={(e) => updateField('contact', 'email', e.target.value)}
                      className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                      placeholder="your.email@example.com"
                      type="email"
                    />
                    <p className="text-xs text-muted-foreground">Your professional email</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground font-semibold">Phone Number</Label>
                    <Input
                      value={portfolioData.contact.phone}
                      onChange={(e) => updateField('contact', 'phone', e.target.value)}
                      className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                      placeholder="+1 (555) 123-4567"
                    />
                    <p className="text-xs text-muted-foreground">Contact number</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground font-semibold">Location</Label>
                    <Input
                      value={portfolioData.contact.location}
                      onChange={(e) => updateField('contact', 'location', e.target.value)}
                      className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
                      placeholder="San Francisco, CA"
                    />
                    <p className="text-xs text-muted-foreground">City, State/Country</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold">Contact Message</Label>
                  <Textarea
                    value={portfolioData.contact.description}
                    onChange={(e) => updateField('contact', 'description', e.target.value)}
                    rows={4}
                    className="glass border-2 border-border/50 focus:border-primary transition-all resize-none"
                    placeholder="A message encouraging people to reach out..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Appears on the contact page - {portfolioData.contact.description.length} characters
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
