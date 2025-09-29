# 🚀 Advanced Form Builder with TipTap

A sophisticated, visual, and highly customizable form builder application built with Next.js, TypeScript, and TipTap. This project delivers a professional-grade form building experience with advanced layout systems and comprehensive design customization capabilities.

## ✨ Features

### 🎨 **Advanced Design System**
- **Global Theme Controls**: Background colors, typography, spacing, and branding
- **Field-Level Styling**: Custom colors, borders, focus states, and iconography
- **Dynamic Tailwind CSS**: Utility classes stored as attributes for maximum flexibility
- **Live Preview**: Real-time rendering of all design changes

### 🏗️ **Structural Layout System**
- **Single Column Containers**: Full-width layout blocks
- **Two Column Containers**: Side-by-side field arrangements
- **Nested Field Support**: Drag fields into and between containers
- **Structure Palette**: Dedicated UI for inserting layout blocks

### 📝 **Comprehensive Form Fields**
- **Input Types**: Text, Long Text, Email, Phone, Number
- **Selection Types**: Dropdown, Radio Buttons, Checkbox
- **Special Types**: File Upload, Separator/Divider
- **Field Icons**: Emoji-based iconography system
- **Validation**: Required fields, min/max length, number ranges

### 🔧 **Professional Interface**
- **Tabbed Inspectors**: Content & Logic vs Design separation
- **Visual Controls**: Color pickers, dropdown selectors, sliders
- **Real-time Updates**: Instant preview of all changes
- **Enhanced Schema Export**: Complete JSON with design data

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript for complete type safety
- **Styling**: Tailwind CSS with dynamic utility classes
- **Editor**: TipTap for structural node management
- **Icons**: Heroicons and emoji-based field icons
- **State**: React hooks with hierarchical design system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### 1. **Building Forms**
- Use the **Structure Palette** (left sidebar) to add layout containers
- Click field buttons in the toolbar to add form elements
- Drag fields into containers for organized layouts

### 2. **Customizing Design**
- Click the **🎨 Theme** button for global form styling
- Select any field and use the **Design** tab for field-specific styling
- Adjust colors, borders, spacing, and typography in real-time

### 3. **Field Configuration**
- Select fields to access the **Content & Logic** tab
- Configure labels, placeholders, descriptions, and validation
- Set up options for dropdown and radio button fields

### 4. **Preview & Export**
- Click **Preview Form** to see the functional form
- Use **Export Schema** to get complete JSON with design data
- Test form validation and submission in preview mode

## 🏗️ Architecture

### **Component Structure**
```
src/
├── components/
│   ├── AdvancedFormBuilder.tsx     # Main interface
│   ├── structure/
│   │   └── StructurePalette.tsx    # Layout controls
│   ├── design/
│   │   ├── ThemeInspector.tsx      # Global theming
│   │   └── FieldDesignInspector.tsx # Field styling
│   ├── tiptap/nodes/               # TipTap container nodes
│   └── preview/
│       └── FormPreview.tsx         # Live form preview
├── types/
│   └── form.ts                     # TypeScript interfaces
```

### **Design System Hierarchy**
1. **Global Theme** → Form-wide styling (background, fonts, spacing)
2. **Layout Containers** → Structure and organization
3. **Individual Fields** → Field-specific styling and behavior

### **Enhanced JSON Schema**
```json
{
  "id": "form_123",
  "title": "Contact Form",
  "design": {
    "backgroundColor": "bg-gray-50",
    "fontFamily": "font-sans",
    "logoUrl": "https://example.com/logo.png"
  },
  "fields": [
    {
      "id": "field_1",
      "type": "text",
      "label": "Full Name",
      "layout": "two-column-left",
      "style": {
        "labelColor": "text-gray-900",
        "inputBorderRadius": "rounded-lg",
        "inputFocusColor": "focus:ring-blue-500"
      }
    }
  ],
  "containers": [
    {
      "id": "container_1",
      "type": "two-column",
      "leftFields": ["field_1"],
      "rightFields": ["field_2"]
    }
  ]
}
```

## 🎯 Key Features Implemented

- ✅ **Structure Palette** with layout block insertion
- ✅ **Global Theme Inspector** with visual controls
- ✅ **Field Design System** with tabbed interface
- ✅ **Dynamic Tailwind Classes** stored in node attributes
- ✅ **Enhanced JSON Schema** with complete design data
- ✅ **Live Preview** with custom styling
- ✅ **Professional UI** with modern design patterns

## 🔮 Future Enhancements

- **Drag & Drop Reordering**: Visual field repositioning
- **Advanced Validation**: Custom regex patterns and rules
- **Form Templates**: Pre-built form designs
- **API Integration**: Backend form submission
- **Multi-page Forms**: Step-by-step form flows

## 📄 License

This project is built for educational and development purposes.

---

**Built with ❤️ using Next.js, TypeScript, and TipTap**
