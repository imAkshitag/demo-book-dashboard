import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Plus, Search, Edit, Trash2, Library, BookMarked, Users, BarChart3, ArrowUpDown, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  genre: string;
  status: "Available" | "Issued";
  dateAdded: string;
  lastUpdated: string;
}

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Romance",
  "Science Fiction", 
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Technical"
];

const Dashboard = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    genre: "",
    status: "Available" as "Available" | "Issued"
  });

  // Load books from localStorage on mount
  useEffect(() => {
    const savedBooks = localStorage.getItem("library-books");
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  // Save books to localStorage whenever books change
  useEffect(() => {
    localStorage.setItem("library-books", JSON.stringify(books));
  }, [books]);

  const resetForm = () => {
    setFormData({ isbn: "", title: "", author: "", genre: "", status: "Available" });
    setEditingBook(null);
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.isbn || !formData.title || !formData.author || !formData.genre) {
      toast({
        title: "Error",
        description: "Please fill in all fields including ISBN",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toLocaleDateString();
    const newBook: Book = {
      id: Date.now().toString(),
      ...formData,
      dateAdded: now,
      lastUpdated: now
    };

    setBooks(prev => [...prev, newBook]);
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Book Added",
      description: `"${formData.title}" has been added to the library`,
    });
  };

  const handleEditBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !formData.isbn || !formData.title || !formData.author || !formData.genre) {
      toast({
        title: "Error",
        description: "Please fill in all fields including ISBN",
        variant: "destructive"
      });
      return;
    }

    setBooks(prev => prev.map(book => 
      book.id === editingBook.id 
        ? { ...book, ...formData, lastUpdated: new Date().toLocaleDateString() }
        : book
    ));

    resetForm();
    
    toast({
      title: "Book Updated",
      description: `"${formData.title}" has been updated`,
    });
  };

  const handleDeleteBook = (book: Book) => {
    setBooks(prev => prev.filter(b => b.id !== book.id));
    toast({
      title: "Book Deleted",
      description: `"${book.title}" has been removed from the library`,
    });
  };

  const startEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      genre: book.genre,
      status: book.status
    });
  };

  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = filterGenre === "all" || book.genre === filterGenre;
      const matchesStatus = filterStatus === "all" || book.status === filterStatus;
      
      return matchesSearch && matchesGenre && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Book] as string;
      let bValue = b[sortBy as keyof Book] as string;
      
      // Handle date sorting
      if (sortBy === "dateAdded" || sortBy === "lastUpdated") {
        aValue = new Date(aValue).getTime().toString();
        bValue = new Date(bValue).getTime().toString();
      }
      
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const stats = {
    total: books.length,
    available: books.filter(b => b.status === "Available").length,
    issued: books.filter(b => b.status === "Issued").length,
    genres: new Set(books.map(b => b.genre)).size
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">LibraryManager Pro</h1>
                <p className="text-primary-foreground/80">Digital Book Management System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-book-primary/10 rounded-lg flex items-center justify-center">
                  <Library className="h-6 w-6 text-book-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Books</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-book-success/10 rounded-lg flex items-center justify-center">
                  <BookMarked className="h-6 w-6 text-book-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-foreground">{stats.available}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-book-warning/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-book-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issued</p>
                  <p className="text-2xl font-bold text-foreground">{stats.issued}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-book-accent/50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-book-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Genres</p>
                  <p className="text-2xl font-bold text-foreground">{stats.genres}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Book Stats Graph */}
        <div className="mb-8 bg-background rounded-lg shadow-soft p-6">
          <h2 className="text-xl font-semibold mb-4">Book Statistics Overview</h2>
          <ChartContainer config={{
            total: { label: "Total Books", color: "#6366f1" },
            available: { label: "Available", color: "#22c55e" },
            issued: { label: "Issued", color: "#f59e42" }
          }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[stats]} barCategoryGap={40}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" type="category" tick={false} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#6366f1" name="Total Books" radius={[8,8,0,0]} />
                <Bar dataKey="available" fill="#22c55e" name="Available" radius={[8,8,0,0]} />
                <Bar dataKey="issued" fill="#f59e42" name="Issued" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Controls */}
        <Card className="mb-8 shadow-soft">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Book Management</CardTitle>
                <CardDescription>Add, edit, and manage your book collection</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Book
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Book</DialogTitle>
                    <DialogDescription>
                      Add a new book to your library collection
                    </DialogDescription>
                  </DialogHeader>
                   <form onSubmit={handleAddBook} className="space-y-4">
                     <div>
                       <Label htmlFor="isbn">ISBN</Label>
                       <Input
                         id="isbn"
                         value={formData.isbn}
                         onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                         placeholder="Enter ISBN (e.g., 978-3-16-148410-0)"
                       />
                     </div>
                     <div>
                       <Label htmlFor="title">Title</Label>
                       <Input
                         id="title"
                         value={formData.title}
                         onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                         placeholder="Enter book title"
                       />
                     </div>
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                        placeholder="Enter author name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="genre">Genre</Label>
                      <Select 
                        value={formData.genre} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENRES.map(genre => (
                            <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value: "Available" | "Issued") => setFormData(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Issued">Issued</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" variant="hero" className="flex-1">
                        Add Book
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
           <CardContent>
             <div className="flex flex-col gap-4">
               <div className="flex flex-col sm:flex-row gap-4">
                 <div className="relative flex-1">
                   <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                   <Input
                     placeholder="Search books by title, author, or ISBN..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-10"
                   />
                 </div>
                 <Select value={filterGenre} onValueChange={setFilterGenre}>
                   <SelectTrigger className="w-full sm:w-48">
                     <SelectValue placeholder="Filter by genre" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Genres</SelectItem>
                     {GENRES.map(genre => (
                       <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                 <Select value={filterStatus} onValueChange={setFilterStatus}>
                   <SelectTrigger className="w-full sm:w-48">
                     <SelectValue placeholder="Filter by status" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Status</SelectItem>
                     <SelectItem value="Available">Available</SelectItem>
                     <SelectItem value="Issued">Issued</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               
               {/* Sorting Controls */}
               <div className="flex flex-col sm:flex-row gap-4 items-center">
                 <div className="flex items-center gap-2">
                   <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                   <span className="text-sm text-muted-foreground">Sort by:</span>
                 </div>
                 <Select value={sortBy} onValueChange={setSortBy}>
                   <SelectTrigger className="w-full sm:w-48">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="title">Title</SelectItem>
                     <SelectItem value="author">Author</SelectItem>
                     <SelectItem value="genre">Genre</SelectItem>
                     <SelectItem value="dateAdded">Date Added</SelectItem>
                     <SelectItem value="lastUpdated">Last Updated</SelectItem>
                   </SelectContent>
                 </Select>
                 <Select value={sortOrder} onValueChange={setSortOrder}>
                   <SelectTrigger className="w-full sm:w-32">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="asc">Ascending</SelectItem>
                     <SelectItem value="desc">Descending</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
           </CardContent>
        </Card>

        {/* Books Grid */}
         {filteredAndSortedBooks.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {books.length === 0 ? "No books yet" : "No books found"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {books.length === 0 
                  ? "Add your first book to get started with your library collection"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {books.length === 0 && (
                <Button 
                  variant="hero" 
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Book
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredAndSortedBooks.map(book => (
              <Card key={book.id} className="shadow-soft hover:shadow-book transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                   <div className="flex justify-between items-start mb-4">
                     <div className="flex-1">
                       <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-2">
                         {book.title}
                       </h3>
                       <p className="text-muted-foreground text-sm mb-1">by {book.author}</p>
                       <p className="text-muted-foreground text-xs mb-2">ISBN: {book.isbn}</p>
                       <Badge 
                         variant="secondary" 
                         className="text-xs"
                       >
                         {book.genre}
                       </Badge>
                     </div>
                    <Badge 
                      variant={book.status === "Available" ? "default" : "secondary"}
                      className={cn(
                        "ml-2",
                        book.status === "Available" 
                          ? "bg-book-success text-white" 
                          : "bg-book-warning text-white"
                      )}
                    >
                      {book.status}
                    </Badge>
                  </div>
                  
                   <div className="text-xs text-muted-foreground mb-4 space-y-1">
                     <div className="flex items-center gap-1">
                       <Clock className="h-3 w-3" />
                       <span>Added: {book.dateAdded}</span>
                     </div>
                     {book.lastUpdated && book.lastUpdated !== book.dateAdded && (
                       <div className="flex items-center gap-1">
                         <Clock className="h-3 w-3" />
                         <span>Updated: {book.lastUpdated}</span>
                       </div>
                     )}
                   </div>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => startEdit(book)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Book</DialogTitle>
                          <DialogDescription>
                            Update the book information
                          </DialogDescription>
                        </DialogHeader>
                         <form onSubmit={handleEditBook} className="space-y-4">
                           <div>
                             <Label htmlFor="edit-isbn">ISBN</Label>
                             <Input
                               id="edit-isbn"
                               value={formData.isbn}
                               onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                               placeholder="Enter ISBN (e.g., 978-3-16-148410-0)"
                             />
                           </div>
                           <div>
                             <Label htmlFor="edit-title">Title</Label>
                             <Input
                               id="edit-title"
                               value={formData.title}
                               onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                               placeholder="Enter book title"
                             />
                           </div>
                          <div>
                            <Label htmlFor="edit-author">Author</Label>
                            <Input
                              id="edit-author"
                              value={formData.author}
                              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                              placeholder="Enter author name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-genre">Genre</Label>
                            <Select 
                              value={formData.genre} 
                              onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select genre" />
                              </SelectTrigger>
                              <SelectContent>
                                {GENRES.map(genre => (
                                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="edit-status">Status</Label>
                            <Select 
                              value={formData.status} 
                              onValueChange={(value: "Available" | "Issued") => setFormData(prev => ({ ...prev, status: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="Issued">Issued</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button type="submit" variant="hero" className="flex-1">
                              Update Book
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={resetForm}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteBook(book)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;