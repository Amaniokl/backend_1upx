// scripts/populateFieldsData.js
import { db } from '../config/database.js';
import { Fields, createFieldsTable } from '../models/fieldsModel.js';

// SVG paths for Lucide icons
const iconPaths = {
  // Basic shapes and UI elements
  Code: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  Video: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  PenTool: "M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z M2 2l7.586 7.586",
  Palette: "M12 19c.828 0 1.5-.672 1.5-1.5S12.828 16 12 16s-1.5.672-1.5 1.5.672 1.5 1.5 1.5z M19.5 12c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5z M16 4.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5z M8 4.5c0 .828-.672 1.5-1.5 1.5S5 5.328 5 4.5 5.672 3 6.5 3 8 3.672 8 4.5z M4.5 12c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5z",
  LayoutDashboard: "M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z",
  Briefcase: "M20 7h-4V3a1 1 0 00-1-1H9a1 1 0 00-1 1v4H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1zM9 3h6v4H9V3zm11 16H4V8h16v11z",
  Search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  Target: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 18a6 6 0 100-12 6 6 0 000 12z M12 14a2 2 0 100-4 2 2 0 000 4z",
  BarChart2: "M18 20V10 M12 20V4 M6 20v-6",
  Users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  Music: "M9 18V5l12-2v13 M9 9L21 7 M9 13L21 11 M9 18a3 3 0 11-6 0 3 3 0 016 0z M21 18a3 3 0 11-6 0 3 3 0 016 0z",
  BookOpen: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  User: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 7a4 4 0 100-8 4 4 0 000 8z",
  MessageSquare: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z",
  Database: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7 M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4 M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4",
  Image: "M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M21 15l-5-5L5 21"
};

// Convert the fields array to database format
const fieldsData = [
  {
    name: "Software Developer",
    svgPath: iconPaths.Code,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50/90 to-cyan-50/90",
    shadowColor: "shadow-blue-500/25",
    category: "Technology",
    displayOrder: 1
  },
  {
    name: "Video Generator",
    svgPath: iconPaths.Video,
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-50/90 to-rose-50/90",
    shadowColor: "shadow-pink-500/25",
    category: "Media",
    displayOrder: 2
  },
  {
    name: "Content Creator",
    svgPath: iconPaths.PenTool,
    gradient: "from-purple-500 to-violet-500",
    bgGradient: "from-purple-50/90 to-violet-50/90",
    shadowColor: "shadow-purple-500/25",
    category: "Creative",
    displayOrder: 3
  },
  {
    name: "Designer",
    svgPath: iconPaths.Palette,
    gradient: "from-rose-500 to-orange-500",
    bgGradient: "from-rose-50/90 to-orange-50/90",
    shadowColor: "shadow-rose-500/25",
    category: "Creative",
    displayOrder: 4
  },
  {
    name: "UI/UX Designer",
    svgPath: iconPaths.LayoutDashboard,
    gradient: "from-fuchsia-500 to-pink-500",
    bgGradient: "from-fuchsia-50/90 to-pink-50/90",
    shadowColor: "shadow-fuchsia-500/25",
    category: "Design",
    displayOrder: 5
  },
  {
    name: "Business Consulting",
    svgPath: iconPaths.Briefcase,
    gradient: "from-blue-500 to-emerald-500",
    bgGradient: "from-blue-50/90 to-emerald-50/90",
    shadowColor: "shadow-blue-500/25",
    category: "Business",
    displayOrder: 6
  },
  {
    name: "Market Research",
    svgPath: iconPaths.Search,
    gradient: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-50/90 to-blue-50/90",
    shadowColor: "shadow-indigo-500/25",
    category: "Business",
    displayOrder: 7
  },
  {
    name: "Strategic Planning",
    svgPath: iconPaths.Target,
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-50/90 to-amber-50/90",
    shadowColor: "shadow-orange-500/25",
    category: "Business",
    displayOrder: 8
  },
  {
    name: "Financial Analysis",
    svgPath: iconPaths.BarChart2,
    gradient: "from-slate-600 to-gray-600",
    bgGradient: "from-slate-50/90 to-gray-50/90",
    shadowColor: "shadow-slate-500/25",
    category: "Finance",
    displayOrder: 9
  },
  {
    name: "Business Outreach",
    svgPath: iconPaths.Users,
    gradient: "from-teal-500 to-cyan-500",
    bgGradient: "from-teal-50/90 to-cyan-50/90",
    shadowColor: "shadow-teal-500/25",
    category: "Business",
    displayOrder: 10
  },
  {
    name: "Music & Audio",
    svgPath: iconPaths.Music,
    gradient: "from-red-500 to-pink-500",
    bgGradient: "from-red-50/90 to-pink-50/90",
    shadowColor: "shadow-red-500/25",
    category: "Arts",
    displayOrder: 11
  },
  {
    name: "Writing & Translation",
    svgPath: iconPaths.BookOpen,
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50/90 to-purple-50/90",
    shadowColor: "shadow-violet-500/25",
    category: "Content",
    displayOrder: 12
  },
  {
    name: "Personal Growth",
    svgPath: iconPaths.User,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50/90 to-emerald-50/90",
    shadowColor: "shadow-green-500/25",
    category: "Personal",
    displayOrder: 13
  },
  {
    name: "Consulting",
    svgPath: iconPaths.MessageSquare,
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-50/90 to-blue-50/90",
    shadowColor: "shadow-cyan-500/25",
    category: "Business",
    displayOrder: 14
  },
  {
    name: "Data",
    svgPath: iconPaths.Database,
    gradient: "from-gray-600 to-slate-600",
    bgGradient: "from-gray-50/90 to-slate-50/90",
    shadowColor: "shadow-gray-500/25",
    category: "Technology",
    displayOrder: 15
  },
  {
    name: "Image Generation",
    svgPath: iconPaths.Image,
    gradient: "from-amber-500 to-yellow-500",
    bgGradient: "from-amber-50/90 to-yellow-50/90",
    shadowColor: "shadow-amber-500/25",
    category: "Creative",
    displayOrder: 16
  }
];

// Function to populate the database
const populateFields = async () => {
  try {
    console.log('Creating Fields table if needed...');
    await createFieldsTable();
    
    console.log('Adding fields to database...');
    for (const field of fieldsData) {
      try {
        await Fields.create(field);
        console.log(`✅ Added field: ${field.name}`);
      } catch (error) {
        console.error(`❌ Error adding field ${field.name}:`, error);
      }
    }
    
    console.log('✅ Fields population complete');
  } catch (error) {
    console.error('❌ Error in fields population:', error);
  } 
};

populateFields();
