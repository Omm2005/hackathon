"use client"

import {
  BadgeCheck,
  Bell,
  Bug,
  ChevronsUpDown,
  CreditCard,
  Github,
  Instagram,
  LogOut,
  Sparkles,
  Sun,
  X,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { signOutAction } from "@/server/auth/authActions"
import { ThemeSwitcher } from "../ThemeButton"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                    {user.name.slice(0, 1) + (user.name.split(" ")[1]?.slice(0, 1) ?? "")}
                  </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar!} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.slice(0, 1) + (user.name.split(" ")[1]?.slice(0, 1) ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer py-1 hover:bg-transparent!">
            <div className="flex items-center justify-between w-full px-0" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <Sun className="size-4" />
                <span className="text-sm">Theme</span>
              </div>
              <ThemeSwitcher />
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

            <DropdownMenuGroup>
                           <DropdownMenuItem asChild>
                <Link href="https://github.com/Omm2005/Athyna/" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Github />
                  Github
                </Link>
              </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                <Link href="https://x.com/maiommhoon" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <X />
                  X
                </Link>
              </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                <Link href="https://instagram.com/maiommhoon" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Instagram />
                    Instagram
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="https://athyna.userjot.com/?cursor=1&order=top&limit=10" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Bug />
                  Feature/Bug Report
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOutAction()} data-variant="destructive" >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
