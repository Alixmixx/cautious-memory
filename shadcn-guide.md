# Comprehensive shadcn/ui Components Documentation

## Overview

shadcn/ui is a collection of reusable components built on Radix UI primitives and styled with Tailwind CSS. Unlike traditional component libraries, shadcn/ui provides component source code that developers copy directly into their projects, giving complete control over the code. The library includes **50+ components** across multiple categories with full TypeScript support and accessibility built-in.

## Getting Started with shadcn/ui

### Prerequisites
- **Node.js** 16.0 or higher
- **React** 16.8 or higher (supports React 19)
- **Tailwind CSS** installed and configured
- **TypeScript** (optional but recommended)

### Installation Process

#### 1. Initialize Your Project
```bash
# For new projects
npx shadcn@latest init

# For existing projects
npx shadcn@latest init
```

#### 2. Configuration Setup
During initialization, you'll configure:
- **Style**: Choose between "new-york" or "default" styles
- **Base color**: neutral, gray, zinc, stone, or slate
- **CSS variables**: For theming (recommended)
- **Import aliases**: Component paths configuration

#### 3. components.json Configuration
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### Adding Components
```bash
# Add specific components
npx shadcn@latest add button card

# Add all components
npx shadcn@latest add --all
```

### Project Structure
```
src/
├── components/
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── ...
├── lib/
│   └── utils.ts         # cn utility function
└── styles/
    └── globals.css      # Global styles with CSS variables
```

## Component Categories

### Form & Input Components (14 components)

#### Button
**Description**: Displays a button or component that looks like a button
**Installation**: `npx shadcn@latest add button`
**Dependencies**: `@radix-ui/react-slot`, `class-variance-authority`

```tsx
import { Button } from "@/components/ui/button"

// Basic usage
<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>

// With icons
<Button>
  <Mail className="mr-2 h-4 w-4" /> Login with Email
</Button>

// As child component (for links)
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

**Props**:
- `variant`: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `asChild`: boolean

#### Input
**Description**: Displays a form input field
**Installation**: `npx shadcn@latest add input`

```tsx
import { Input } from "@/components/ui/input"

<Input type="email" placeholder="m@example.com" />
<Input type="password" />
<Input type="file" />
<Input disabled />
```

#### Checkbox
**Description**: A control for toggling between checked and unchecked states
**Installation**: `npx shadcn@latest add checkbox`
**Dependencies**: `@radix-ui/react-checkbox`

```tsx
import { Checkbox } from "@/components/ui/checkbox"

<Checkbox id="terms" />
<Checkbox checked="indeterminate" />
<Checkbox disabled />
```

#### Form
**Description**: Building forms with React Hook Form and Zod validation
**Installation**: `npx shadcn@latest add form`
**Dependencies**: `react-hook-form`, `@hookform/resolvers`, `zod`

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  username: z.string().min(2).max(50),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

#### Select
**Description**: Displays a list of options for selection
**Installation**: `npx shadcn@latest add select`
**Dependencies**: `@radix-ui/react-select`

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>
```

#### Textarea
**Description**: Displays a form textarea
**Installation**: `npx shadcn@latest add textarea`

```tsx
import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Type your message here." />
<Textarea disabled />
```

#### Switch
**Description**: A control for toggling between on and off states
**Installation**: `npx shadcn@latest add switch`
**Dependencies**: `@radix-ui/react-switch`

```tsx
import { Switch } from "@/components/ui/switch"

<Switch />
<Switch disabled />
<Switch checked={airplane} onCheckedChange={setAirplane} />
```

#### Radio Group
**Description**: A set of radio buttons for single selection
**Installation**: `npx shadcn@latest add radio-group`
**Dependencies**: `@radix-ui/react-radio-group`

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

<RadioGroup defaultValue="comfortable">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="default" id="r1" />
    <Label htmlFor="r1">Default</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="comfortable" id="r2" />
    <Label htmlFor="r2">Comfortable</Label>
  </div>
</RadioGroup>
```

#### Additional Form Components:
- **Combobox**: Autocomplete input with command palette
- **Input OTP**: One-time password input with copy/paste support
- **Label**: Accessible label for form controls
- **Slider**: Range input for selecting values
- **Toggle**: Two-state button (on/off)
- **Toggle Group**: Set of toggle buttons

### Layout Components (9 components)

#### Card
**Description**: Displays a card with header, content, and footer
**Installation**: `npx shadcn@latest add card`

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <Button>Save changes</Button>
  </CardFooter>
</Card>
```

#### Accordion
**Description**: Vertically stacked interactive headings that reveal content
**Installation**: `npx shadcn@latest add accordion`
**Dependencies**: `@radix-ui/react-accordion`

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

#### Tabs
**Description**: Layered sections of content displayed one at a time
**Installation**: `npx shadcn@latest add tabs`
**Dependencies**: `@radix-ui/react-tabs`

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings</TabsContent>
  <TabsContent value="password">Password settings</TabsContent>
</Tabs>
```

#### Sidebar
**Description**: Composable, themeable sidebar component
**Installation**: `npx shadcn@latest add sidebar`

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Home />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <main>
    <SidebarTrigger />
    {children}
  </main>
</SidebarProvider>
```

#### Additional Layout Components:
- **Aspect Ratio**: Maintains content within desired ratio
- **Collapsible**: Expandable/collapsible panel
- **Resizable**: Accessible resizable panel groups
- **Scroll Area**: Custom styled scrollbar area
- **Separator**: Visual or semantic content separator

### Navigation Components (6 components)

#### Navigation Menu
**Description**: Collection of links for navigating websites
**Installation**: `npx shadcn@latest add navigation-menu`
**Dependencies**: `@radix-ui/react-navigation-menu`

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/docs">
          Documentation
        </NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

#### Dropdown Menu
**Description**: Menu of actions triggered by a button
**Installation**: `npx shadcn@latest add dropdown-menu`
**Dependencies**: `@radix-ui/react-dropdown-menu`

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Additional Navigation Components:
- **Breadcrumb**: Displays hierarchical navigation path
- **Command**: Fast, composable command menu
- **Menubar**: Desktop application-style menu bar
- **Pagination**: Page navigation with next/previous links

### Overlay Components (8 components)

#### Dialog
**Description**: Modal window overlaid on primary window
**Installation**: `npx shadcn@latest add dialog`
**Dependencies**: `@radix-ui/react-dialog`

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

#### Sheet
**Description**: Complementary content that slides in from edges
**Installation**: `npx shadcn@latest add sheet`

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

#### Popover
**Description**: Displays rich content in a portal
**Installation**: `npx shadcn@latest add popover`
**Dependencies**: `@radix-ui/react-popover`

```tsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

<Popover>
  <PopoverTrigger asChild>
    <Button>Open popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    Place content for the popover here.
  </PopoverContent>
</Popover>
```

#### Additional Overlay Components:
- **Alert Dialog**: Modal requiring user response
- **Context Menu**: Right-click triggered menu
- **Drawer**: Mobile-optimized sliding panel
- **Hover Card**: Preview content on hover
- **Tooltip**: Information popup on hover/focus

### Data Display Components (6 components)

#### Table & Data Table
**Description**: Responsive table with optional advanced features
**Installation**: `npx shadcn@latest add table`
**For Data Table**: Also install `@tanstack/react-table`

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

<Table>
  <TableCaption>A list of recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Avatar
**Description**: Image element with fallback for user representation
**Installation**: `npx shadcn@latest add avatar`
**Dependencies**: `@radix-ui/react-avatar`

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

#### Badge
**Description**: Small status descriptor for UI elements
**Installation**: `npx shadcn@latest add badge`

```tsx
import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

#### Carousel
**Description**: Slideshow component with swipe gestures
**Installation**: `npx shadcn@latest add carousel`
**Dependencies**: `embla-carousel-react`

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

<Carousel>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

### Feedback Components (5 components)

#### Alert
**Description**: Displays callout for user attention
**Installation**: `npx shadcn@latest add alert`

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components using the CLI.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired.
  </AlertDescription>
</Alert>
```

#### Progress
**Description**: Shows completion progress of a task
**Installation**: `npx shadcn@latest add progress`

```tsx
import { Progress } from "@/components/ui/progress"

<Progress value={33} />
<Progress value={66} className="w-[60%]" />
```

#### Skeleton
**Description**: Placeholder while content loads
**Installation**: `npx shadcn@latest add skeleton`

```tsx
import { Skeleton } from "@/components/ui/skeleton"

<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
```

#### Sonner (Toast)
**Description**: Brief notification messages
**Installation**: `npx shadcn@latest add sonner`
**Dependencies**: `sonner`

```tsx
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

// In root layout
<Toaster />

// To show toast
toast("Event created successfully")
toast.success("Changes saved")
toast.error("Something went wrong")
```

### Date & Time Components (2 components)

#### Calendar
**Description**: Date selection component
**Installation**: `npx shadcn@latest add calendar`
**Dependencies**: `react-day-picker`, `date-fns`

```tsx
import { Calendar } from "@/components/ui/calendar"

const [date, setDate] = React.useState<Date | undefined>(new Date())

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>
```

#### Date Picker
**Description**: Calendar in a popover for date selection
**Installation**: `npx shadcn@latest add popover calendar`

```tsx
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, "PPP") : <span>Pick a date</span>}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      initialFocus
    />
  </PopoverContent>
</Popover>
```

### Data Visualization (1 component)

#### Chart
**Description**: Beautiful charts using Recharts
**Installation**: `npx shadcn@latest add chart`
**Dependencies**: `recharts`

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
]

<ChartContainer config={chartConfig}>
  <BarChart data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" />
    <Bar dataKey="mobile" fill="var(--color-mobile)" />
  </BarChart>
</ChartContainer>
```

**Available Chart Types**:
- Bar Chart
- Line Chart
- Area Chart
- Pie Chart
- Radar Chart
- Radial Chart

## Theming and Customization

### CSS Variables Configuration
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}
```

### Dark Mode Setup
```bash
npm install next-themes
```

```tsx
// components/theme-provider.tsx
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// In root layout
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### Utility Function
```tsx
// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Common Patterns and Best Practices

### Component Composition
```tsx
// Combining components for complex UI
<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
    <CardDescription>Your activity overview</CardDescription>
  </CardHeader>
  <CardContent>
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Progress value={75} />
      </TabsContent>
    </Tabs>
  </CardContent>
</Card>
```

### Form with Validation
```tsx
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  )
}
```

### Responsive Design
```tsx
// Mobile-first responsive patterns
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <Card key={item.id}>
      {/* Card content */}
    </Card>
  ))}
</div>

// Responsive dialog/drawer
const isDesktop = useMediaQuery("(min-width: 768px)")

{isDesktop ? (
  <Dialog>
    <DialogContent>Content</DialogContent>
  </Dialog>
) : (
  <Drawer>
    <DrawerContent>Content</DrawerContent>
  </Drawer>
)}
```

## Key Features Across All Components

- **Full Accessibility**: WAI-ARIA compliant with keyboard navigation
- **TypeScript Support**: Complete type definitions included
- **Customizable**: Full control over styling with Tailwind CSS
- **Composable**: Built on Radix UI's composable primitives
- **Server Components**: Compatible with React Server Components
- **No Vendor Lock-in**: You own the code after installation

## Conclusion

shadcn/ui provides a comprehensive, modern component library that balances flexibility with convenience. Its copy-paste approach gives developers complete control while maintaining consistency and best practices. With 50+ production-ready components covering all common UI patterns, excellent documentation, and active community support, it's an ideal choice for building modern React applications.