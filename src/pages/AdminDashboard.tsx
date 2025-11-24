import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContent } from '@/contexts/ContentContext';
import { logout, isAuthenticated, verifyAuth } from '@/lib/adminAuth';
import { useToast } from '@/hooks/use-toast';
import { contactAPI, authAPI } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  LogOut, 
  Save, 
  User, 
  Briefcase, 
  Code, 
  FolderGit2, 
  Award, 
  Mail,
  Home,
  Plus,
  Trash2,
  Inbox,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const { content, updateContent, loading: contentLoading } = useContent();
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Update editedContent when content changes
  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  // Fetch contacts when component mounts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setContactsLoading(true);
      const response = await contactAPI.getContacts({ limit: 100 });
      setContacts(response.contacts || []);
    } catch (error: any) {
      console.error('Failed to fetch contacts:', error);
      toast({
        title: "Failed to Load Contacts",
        description: error.response?.data?.message || "Could not fetch contacts.",
        variant: "destructive",
      });
    } finally {
      setContactsLoading(false);
    }
  };

  const handleContactStatusChange = async (id: string, status: 'new' | 'read' | 'responded') => {
    try {
      await contactAPI.updateContactStatus(id, status);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
      toast({
        title: "Status Updated",
        description: `Contact marked as ${status}.`,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleContactDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      await contactAPI.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast({
        title: "Contact Deleted",
        description: "Contact has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Failed to delete contact.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/admin/login');
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateContent(editedContent);
      toast({
        title: "Changes Saved",
        description: "Your portfolio content has been updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addSkillToCategory = (categoryIndex: number) => {
    const newContent = { ...editedContent };
    newContent.skills[categoryIndex].skills.push('New Skill');
    setEditedContent(newContent);
  };

  const removeSkillFromCategory = (categoryIndex: number, skillIndex: number) => {
    const newContent = { ...editedContent };
    newContent.skills[categoryIndex].skills.splice(skillIndex, 1);
    setEditedContent(newContent);
  };

  const addProject = () => {
    const newContent = { ...editedContent };
    newContent.projects.push({
      title: 'New Project',
      description: 'Project description',
      tech: ['Tech1', 'Tech2'],
      demoUrl: '#',
      codeUrl: '#',
      bgType: 'gradient',
      bgValue: 'from-blue-500 to-purple-600'
    });
    setEditedContent(newContent);
  };

  const removeProject = (index: number) => {
    const newContent = { ...editedContent };
    newContent.projects.splice(index, 1);
    setEditedContent(newContent);
  };

  const addExperience = () => {
    const newContent = { ...editedContent };
    newContent.experience.push({
      year: '2024 - Present',
      role: 'New Role',
      company: 'Company Name',
      description: 'Job description'
    });
    setEditedContent(newContent);
  };

  const removeExperience = (index: number) => {
    const newContent = { ...editedContent };
    newContent.experience.splice(index, 1);
    setEditedContent(newContent);
  };

  return (
    <div className="min-h-screen bg-background dark text-white">
      {/* Header */}
      <header className="glass border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage your portfolio content</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleSave} 
              className="bg-primary hover:bg-primary/90 shadow-elegant"
              disabled={isSaving || contentLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              <Home className="mr-2 h-4 w-4" />
              View Portfolio
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {contentLoading ? (
          <Card className="glass border-2 border-border/50 p-8 space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </Card>
        ) : (
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="glass border-2 border-border/50 p-1">
            <TabsTrigger value="hero" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="mr-2 h-4 w-4" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Briefcase className="mr-2 h-4 w-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Code className="mr-2 h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FolderGit2 className="mr-2 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Award className="mr-2 h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Inbox className="mr-2 h-4 w-4" />
              Contacts
              {contacts.filter(c => c.status === 'new').length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                  {contacts.filter(c => c.status === 'new').length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card className="glass border-2 border-border/50 p-6 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Hero Section
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editedContent.hero.name}
                    onChange={(e) => setEditedContent({
                      ...editedContent,
                      hero: { ...editedContent.hero, name: e.target.value }
                    })}
                    className="glass border-2 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editedContent.hero.title}
                    onChange={(e) => setEditedContent({
                      ...editedContent,
                      hero: { ...editedContent.hero, title: e.target.value }
                    })}
                    className="glass border-2 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={editedContent.hero.subtitle}
                    onChange={(e) => setEditedContent({
                      ...editedContent,
                      hero: { ...editedContent.hero, subtitle: e.target.value }
                    })}
                    className="glass border-2 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={editedContent.hero.imageUrl}
                    onChange={(e) => setEditedContent({
                      ...editedContent,
                      hero: { ...editedContent.hero, imageUrl: e.target.value }
                    })}
                    className="glass border-2 border-border/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editedContent.hero.description}
                  onChange={(e) => setEditedContent({
                    ...editedContent,
                    hero: { ...editedContent.hero, description: e.target.value }
                  })}
                  className="glass border-2 border-border/50 min-h-[100px]"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    value={editedContent.hero.githubUrl}
                    onChange={(e) => setEditedContent({
                      ...editedContent,
                      hero: { ...editedContent.hero, githubUrl: e.target.value }
                    })}
                    className="glass border-2 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    value={editedContent.hero.linkedinUrl}
                    onChange={(e) => setEditedContent({
                      ...editedContent,
                      hero: { ...editedContent.hero, linkedinUrl: e.target.value }
                    })}
                    className="glass border-2 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email URL</Label>
                  <Input
                    value={editedContent.hero.emailUrl}
                    onChange={(e) => setEditedContent({
                      ...editedContent,
                      hero: { ...editedContent.hero, emailUrl: e.target.value }
                    })}
                    className="glass border-2 border-border/50"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about">
            <Card className="glass border-2 border-border/50 p-6 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                About Section
              </h2>
              {editedContent.about.paragraphs.map((para, index) => (
                <div key={index} className="space-y-2">
                  <Label>Paragraph {index + 1}</Label>
                  <Textarea
                    value={para}
                    onChange={(e) => {
                      const newContent = { ...editedContent };
                      newContent.about.paragraphs[index] = e.target.value;
                      setEditedContent(newContent);
                    }}
                    className="glass border-2 border-border/50 min-h-[100px]"
                  />
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* Skills Section */}
          <TabsContent value="skills">
            <Card className="glass border-2 border-border/50 p-6 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Code className="h-6 w-6 text-primary" />
                Skills Section
              </h2>
              {editedContent.skills.map((category, catIndex) => (
                <div key={catIndex} className="space-y-4 p-4 glass rounded-xl border border-border/50">
                  <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input
                      value={category.title}
                      onChange={(e) => {
                        const newContent = { ...editedContent };
                        newContent.skills[catIndex].title = e.target.value;
                        setEditedContent(newContent);
                      }}
                      className="glass border-2 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Skills</Label>
                      <Button
                        size="sm"
                        onClick={() => addSkillToCategory(catIndex)}
                        className="bg-primary/20 hover:bg-primary/30"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Skill
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      {category.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="flex gap-2">
                          <Input
                            value={skill}
                            onChange={(e) => {
                              const newContent = { ...editedContent };
                              newContent.skills[catIndex].skills[skillIndex] = e.target.value;
                              setEditedContent(newContent);
                            }}
                            className="glass border-2 border-border/50"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeSkillFromCategory(catIndex, skillIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* Projects Section */}
          <TabsContent value="projects">
            <Card className="glass border-2 border-border/50 p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FolderGit2 className="h-6 w-6 text-primary" />
                  Projects Section
                </h2>
                <Button onClick={addProject} className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </div>
              {editedContent.projects.map((project, index) => (
                <div key={index} className="space-y-4 p-4 glass rounded-xl border border-border/50">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-semibold">Project {index + 1}</Label>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeProject(index)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={project.title}
                        onChange={(e) => {
                          const newContent = { ...editedContent };
                          newContent.projects[index].title = e.target.value;
                          setEditedContent(newContent);
                        }}
                        className="glass border-2 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Background Type</Label>
                      <select
                        value={project.bgType ?? 'gradient'}
                        onChange={(e) => {
                          const newContent = { ...editedContent };
                          newContent.projects[index].bgType = e.target.value as any;
                          setEditedContent(newContent);
                        }}
                        className="glass border-2 border-border/50 p-2 rounded"
                      >
                        <option value="gradient">Gradient (Tailwind)</option>
                        <option value="image">Image URL</option>
                        <option value="color">Solid Color</option>
                      </select>

                      {project.bgType === 'gradient' && (
                        <div className="space-y-2 mt-2">
                          <Label>Gradient classes</Label>
                          <Input
                            value={project.bgValue ?? ''}
                            onChange={(e) => {
                              const newContent = { ...editedContent };
                              newContent.projects[index].bgValue = e.target.value;
                              setEditedContent(newContent);
                            }}
                            className="glass border-2 border-border/50"
                            placeholder="from-blue-500 to-purple-600"
                          />
                        </div>
                      )}

                      {project.bgType === 'image' && (
                        <div className="space-y-2 mt-2">
                          <Label>Image URL</Label>
                          <Input
                            value={project.bgValue ?? ''}
                            onChange={(e) => {
                              const newContent = { ...editedContent };
                              newContent.projects[index].bgValue = e.target.value;
                              setEditedContent(newContent);
                            }}
                            className="glass border-2 border-border/50"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      )}

                      {project.bgType === 'color' && (
                        <div className="space-y-2 mt-2">
                          <Label>Color (hex or CSS color)</Label>
                          <Input
                            value={project.bgValue ?? ''}
                            onChange={(e) => {
                              const newContent = { ...editedContent };
                              newContent.projects[index].bgValue = e.target.value;
                              setEditedContent(newContent);
                            }}
                            className="glass border-2 border-border/50"
                            placeholder="#0ea5e9"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => {
                        const newContent = { ...editedContent };
                        newContent.projects[index].description = e.target.value;
                        setEditedContent(newContent);
                      }}
                      className="glass border-2 border-border/50"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Demo URL</Label>
                      <Input
                        value={project.demoUrl}
                        onChange={(e) => {
                          const newContent = { ...editedContent };
                          newContent.projects[index].demoUrl = e.target.value;
                          setEditedContent(newContent);
                        }}
                        className="glass border-2 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Code URL</Label>
                      <Input
                        value={project.codeUrl}
                        onChange={(e) => {
                          const newContent = { ...editedContent };
                          newContent.projects[index].codeUrl = e.target.value;
                          setEditedContent(newContent);
                        }}
                        className="glass border-2 border-border/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Technologies (comma-separated)</Label>
                    <Input
                      value={project.tech.join(', ')}
                      onChange={(e) => {
                        const newContent = { ...editedContent };
                        newContent.projects[index].tech = e.target.value.split(',').map(t => t.trim());
                        setEditedContent(newContent);
                      }}
                      className="glass border-2 border-border/50"
                    />
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* Experience Section */}
          <TabsContent value="experience">
            <Card className="glass border-2 border-border/50 p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  Experience Section
                </h2>
                <Button onClick={addExperience} className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </div>
              {editedContent.experience.map((exp, index) => (
                <div key={index} className="space-y-4 p-4 glass rounded-xl border border-border/50">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-semibold">Experience {index + 1}</Label>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input
                        value={exp.year}
                        onChange={(e) => {
                          const newContent = { ...editedContent };
                          newContent.experience[index].year = e.target.value;
                          setEditedContent(newContent);
                        }}
                        className="glass border-2 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={exp.role}
                        onChange={(e) => {
                          const newContent = { ...editedContent };
                          newContent.experience[index].role = e.target.value;
                          setEditedContent(newContent);
                        }}
                        className="glass border-2 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => {
                          const newContent = { ...editedContent };
                          newContent.experience[index].company = e.target.value;
                          setEditedContent(newContent);
                        }}
                        className="glass border-2 border-border/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => {
                        const newContent = { ...editedContent };
                        newContent.experience[index].description = e.target.value;
                        setEditedContent(newContent);
                      }}
                      className="glass border-2 border-border/50"
                    />
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact">
            <Card className="glass border-2 border-border/50 p-6 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                Contact Section
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editedContent.contact.email}
                    onChange={(e) => setEditedContent({
                      ...editedContent,
                      contact: { ...editedContent.contact, email: e.target.value }
                    })}
                    className="glass border-2 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editedContent.contact.phone}
                    onChange={(e) => setEditedContent({
                      ...editedContent,
                      contact: { ...editedContent.contact, phone: e.target.value }
                    })}
                    className="glass border-2 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={editedContent.contact.location}
                    onChange={(e) => setEditedContent({
                      ...editedContent,
                      contact: { ...editedContent.contact, location: e.target.value }
                    })}
                    className="glass border-2 border-border/50"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Contacts Section - NEW */}
          <TabsContent value="contacts">
            <Card className="glass border-2 border-border/50 p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Inbox className="h-6 w-6 text-primary" />
                  Contact Submissions
                </h2>
                <Button
                  onClick={fetchContacts}
                  disabled={contactsLoading}
                  variant="outline"
                  size="sm"
                >
                  {contactsLoading ? 'Loading...' : 'Refresh'}
                </Button>
              </div>

              {contactsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-6 glass rounded-xl border border-border/50 space-y-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-20 w-full rounded-lg" />
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-12">
                  <Inbox className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No contact submissions yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="p-6 glass rounded-xl border border-border/50 space-y-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold">{contact.name}</h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${
                                contact.status === 'new'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : contact.status === 'read'
                                  ? 'bg-yellow-500/20 text-yellow-300'
                                  : 'bg-green-500/20 text-green-300'
                              }`}
                            >
                              {contact.status === 'new' && <Clock className="inline h-3 w-3 mr-1" />}
                              {contact.status === 'read' && <Eye className="inline h-3 w-3 mr-1" />}
                              {contact.status === 'responded' && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                              {contact.status}
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Email:</span>{' '}
                              <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                                {contact.email}
                              </a>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Date:</span>{' '}
                              {new Date(contact.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Subject:</p>
                            <p className="font-medium">{contact.subject}</p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Message:</p>
                            <p className="text-sm whitespace-pre-wrap bg-card/50 p-3 rounded-lg border border-border/30">
                              {contact.message}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-border/30">
                        <select
                          value={contact.status}
                          onChange={(e) => handleContactStatusChange(contact._id, e.target.value as any)}
                          className="glass border-2 border-border/50 px-3 py-2 rounded-lg text-sm"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="responded">Responded</option>
                        </select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}`}>
                            <Mail className="h-4 w-4 mr-1" />
                            Reply
                          </a>
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleContactDelete(contact._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
