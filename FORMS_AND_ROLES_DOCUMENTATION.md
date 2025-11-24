# Forms and Roles Management - Implementation Documentation

## Overview

This document provides a comprehensive guide to the forms implementation and roles/permissions management system in the inventory management admin panel.

---

## 1. Product Management Form

### Location
- **Component**: `components/products/product-form.tsx`
- **Pages**: 
  - Create: `app/(dashboard)/products/new/page.tsx`
  - Edit: `app/(dashboard)/products/[id]/edit/page.tsx`

### Form Structure

#### Basic Information Section
- **Product Name** (required)
  - Type: Text input
  - Validation: 2-100 characters
  - Placeholder: "Enter product name"

- **SKU** (required)
  - Type: Text input (monospace font)
  - Validation: 3-50 characters, uppercase letters, numbers, and hyphens only
  - Pattern: `^[A-Z0-9-]+$`
  - Placeholder: "e.g., PRD-001"

- **Description** (optional)
  - Type: Textarea
  - Validation: Max 500 characters
  - Rows: 4

- **Category** (required)
  - Type: Select dropdown
  - Options: Electronics, Furniture, Clothing, Food & Beverage, Office Supplies, Tools & Equipment, Other

- **Supplier** (optional)
  - Type: Text input
  - Validation: 2-100 characters

- **Product Status**
  - Type: Toggle switch
  - Options: Active / Inactive
  - Default: Active

#### Pricing & Inventory Section
- **Price** (required)
  - Type: Number input with currency prefix ($)
  - Validation: Min 0.01, Max 999,999.99, 2 decimal places
  - Step: 0.01

- **Current Stock** (required)
  - Type: Number input
  - Validation: Integer, Min 0

- **Reorder Point** (required)
  - Type: Number input
  - Validation: Integer, Min 0
  - Help text: "Alert when stock falls below this level"

### Validation Schema
\`\`\`typescript
productFormSchema = {
  name: string (2-100 chars),
  sku: string (3-50 chars, uppercase + numbers + hyphens),
  description: string (max 500 chars, optional),
  category: string (required),
  price: number (0.01-999999.99, 2 decimals),
  stock: integer (min 0),
  reorderPoint: integer (min 0),
  supplier: string (2-100 chars, optional),
  status: enum ["active", "inactive", "discontinued"]
}
\`\`\`

### State Management
- **Library**: React Hook Form with Zod validation
- **Submission**: Async with loading state
- **Error Handling**: Field-level error messages displayed below inputs

---

## 2. User Management Form

### Location
- **Component**: `components/users/user-form.tsx`
- **Pages**: 
  - Create: `app/(dashboard)/users/new/page.tsx`
  - Edit: `app/(dashboard)/users/[id]/edit/page.tsx` (if exists)

### Form Structure

#### User Information Section
- **Full Name** (required)
  - Type: Text input with user icon
  - Validation: 2-100 characters
  - Placeholder: "Enter full name"

- **Email Address** (required)
  - Type: Email input with mail icon
  - Validation: Valid email format
  - Placeholder: "user@inventory.com"

- **Password** (required for create mode only)
  - Type: Password input with lock icon
  - Toggle visibility: Eye/EyeOff icon button
  - Validation:
    - Min 8 characters
    - At least 1 uppercase letter
    - At least 1 lowercase letter
    - At least 1 number
  - Help text: "Must be at least 8 characters with uppercase, lowercase, and numbers"

- **Account Status**
  - Type: Toggle switch
  - Options: Active / Suspended
  - Default: Active
  - Description: "User can access the system" / "User is suspended"

#### Role & Permissions Section
- **User Role** (required)
  - Type: Select dropdown with shield icon
  - Options:
    - Administrator: Full system access including user management
    - Manager: Manage products and inventory operations
    - Staff: Process orders and update inventory
    - Viewer: Read-only access to inventory data
  - Default: Viewer

- **Role Description Display**
  - Dynamic description based on selected role
  - Displayed in highlighted box below role selector

### Validation Schema
\`\`\`typescript
userFormSchema = {
  name: string (2-100 chars),
  email: string (valid email),
  password: string (8+ chars, uppercase, lowercase, number) - optional for edit,
  role: enum ["admin", "manager", "staff", "viewer"],
  status: enum ["active", "suspended"]
}
\`\`\`

### State Management
- **Library**: React Hook Form with Zod validation
- **Password Visibility**: Local state toggle
- **Submission**: Async with loading state
- **Security**: Password field only shown in create mode

---

## 3. Roles & Permissions Management

### Location
- **Components**: 
  - `components/roles/role-form.tsx` - Role creation/editing form
  - `components/roles/roles-table.tsx` - Roles list table
  - `components/users/role-permissions-matrix.tsx` - Permissions reference matrix
- **Pages**:
  - List: `app/(dashboard)/roles/page.tsx`
  - Create: `app/(dashboard)/roles/new/page.tsx`
  - Edit: `app/(dashboard)/roles/[id]/page.tsx`

### Roles Table Structure

#### Columns
1. **Role Name** - With shield icon
2. **Description** - Truncated text
3. **Users** - Count with users icon
4. **Type** - Badge (System/Custom)
5. **Actions** - Dropdown menu (Edit/Delete)

#### Features
- Search functionality
- System roles cannot be deleted (only edited)
- Custom roles can be fully managed
- User count display per role

### Role Form Structure

#### Role Information Section
- **Role Name** (required)
  - Type: Text input with shield icon
  - Validation: 2-50 characters
  - Placeholder: "e.g., Warehouse Manager"

- **Description** (optional)
  - Type: Textarea
  - Validation: Max 200 characters
  - Placeholder: "Describe the purpose and responsibilities of this role"
  - Rows: 3

#### Permissions Section

Permissions are organized by module with granular controls:

##### 1. Dashboard Module
- View Dashboard

##### 2. Products Module
- View Products
- Create Products
- Edit Products
- Delete Products
- Export Products

##### 3. Inventory Module
- View Inventory
- Adjust Stock Levels
- Transfer Stock
- View Stock History

##### 4. Users Module
- View Users
- Create Users
- Edit Users
- Delete Users
- Manage Roles

##### 5. Settings Module
- View Settings
- Edit Settings

##### 6. Reports Module
- View Reports
- Export Reports

### Permission UI Components

Each module section includes:
- **Module Header**: Icon + Name + "Select All" button
- **Permission List**: Checkboxes for each permission
- **Visual Grouping**: Bordered container per module

### Validation Schema
\`\`\`typescript
roleFormSchema = {
  name: string (2-50 chars),
  description: string (max 200 chars, optional),
  permissions: {
    dashboard: { view: boolean },
    products: { view, create, edit, delete, export: boolean },
    inventory: { view, adjust, transfer, viewHistory: boolean },
    users: { view, create, edit, delete, manageRoles: boolean },
    settings: { view, edit: boolean },
    reports: { view, export: boolean }
  }
}
\`\`\`

### State Management
- **Library**: React Hook Form with Zod validation
- **Permission Toggles**: Controlled checkboxes with setValue
- **Select All**: Module-level toggle for all permissions
- **Submission**: Async with loading state

---

## 4. Technical Implementation Details

### Form Validation Approach
- **Library**: Zod for schema validation
- **Integration**: React Hook Form with zodResolver
- **Error Display**: Field-level error messages in red text
- **Real-time Validation**: On blur and submit

### State Management Pattern
\`\`\`typescript
const {
  register,           // Register input fields
  handleSubmit,       // Form submission handler
  formState: { errors }, // Validation errors
  setValue,           // Programmatic value updates
  watch,              // Watch field values
} = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {...}
})
\`\`\`

### Submission Flow
1. User fills form
2. Client-side validation (Zod schema)
3. Loading state activated
4. Async onSubmit handler called
5. Success/error handling
6. Loading state deactivated

### Responsive Design
- **Mobile**: Single column layout
- **Tablet**: 2-column grid for related fields
- **Desktop**: 2-3 column grid for optimal space usage

### Accessibility Features
- Required field indicators (*)
- Label associations with inputs
- Error announcements
- Keyboard navigation support
- Focus management
- ARIA attributes on custom components

---

## 5. Integration Points

### API Endpoints (To Be Implemented)
\`\`\`typescript
// Products
POST   /api/products          - Create product
PUT    /api/products/:id      - Update product
GET    /api/products/:id      - Get product details

// Users
POST   /api/users             - Create user
PUT    /api/users/:id         - Update user
GET    /api/users/:id         - Get user details

// Roles
POST   /api/roles             - Create role
PUT    /api/roles/:id         - Update role
GET    /api/roles             - List all roles
GET    /api/roles/:id         - Get role details
DELETE /api/roles/:id         - Delete role
\`\`\`

### Data Flow
1. Form component receives defaultValues (edit mode)
2. User interacts with form
3. Validation occurs on blur/submit
4. onSubmit prop called with validated data
5. Parent component handles API call
6. Success: Navigate to list page
7. Error: Display error message

---

## 6. Security Considerations

### Password Handling
- Never stored in plain text
- Hashed on server before storage
- Password field only in create mode
- Separate endpoint for password reset

### Role-Based Access Control
- Permissions checked on both client and server
- System roles protected from deletion
- Role changes logged for audit trail
- Minimum permission principle applied

### Input Sanitization
- All inputs validated with Zod
- XSS prevention through React's built-in escaping
- SQL injection prevented by parameterized queries
- File upload validation (if implemented)

---

## 7. Future Enhancements

### Product Form
- Image upload with preview
- Barcode scanner integration
- Bulk import via CSV
- Product variants support
- Multi-currency pricing

### User Form
- Profile picture upload
- Two-factor authentication setup
- Email verification workflow
- Password strength meter
- Activity log display

### Roles & Permissions
- Permission templates
- Role cloning
- Temporary permission grants
- Time-based access control
- Department-based roles

---

## 8. Testing Checklist

### Product Form
- [ ] Required field validation
- [ ] SKU format validation
- [ ] Price decimal validation
- [ ] Stock integer validation
- [ ] Category selection
- [ ] Form submission
- [ ] Error message display
- [ ] Loading state

### User Form
- [ ] Email format validation
- [ ] Password strength validation
- [ ] Password visibility toggle
- [ ] Role selection
- [ ] Status toggle
- [ ] Create vs Edit mode
- [ ] Form submission
- [ ] Error handling

### Roles Management
- [ ] Role creation
- [ ] Role editing
- [ ] Permission toggles
- [ ] Select all functionality
- [ ] Role deletion (custom only)
- [ ] Search functionality
- [ ] User count display
- [ ] System role protection

---

## Conclusion

This implementation provides a robust, professional, and user-friendly form system for managing products, users, and roles in the inventory management system. All forms include comprehensive validation, error handling, and responsive design while maintaining a formal business aesthetic suitable for enterprise use.
