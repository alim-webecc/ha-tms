"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, X, UserPlus, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  status: "online" | "offline" | "busy"
}

interface Assignment {
  user: User
  assignedAt: string
  assignedBy: string
  note?: string
}

interface AssignOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  currentAssignments?: Assignment[]
  onAssign: (userId: string, note: string) => void
}

// Demo-Benutzer
const DEMO_USERS: User[] = [
  { id: "1", name: "Max Mustermann", email: "max@example.com", role: "Disposition", status: "online" },
  { id: "2", name: "Anna Schmidt", email: "anna@example.com", role: "Fahrer", status: "online" },
  { id: "3", name: "Tom Weber", email: "tom@example.com", role: "Disposition", status: "busy" },
  { id: "4", name: "Lisa Müller", email: "lisa@example.com", role: "Buchhaltung", status: "offline" },
  { id: "5", name: "Peter Klein", email: "peter@example.com", role: "Fahrer", status: "online" },
]

export function AssignOrderDialog({
  open,
  onOpenChange,
  orderId,
  currentAssignments = [],
  onAssign,
}: AssignOrderDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [note, setNote] = useState("")

  const filteredUsers = DEMO_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAssign = () => {
    if (selectedUser) {
      onAssign(selectedUser.id, note)
      setSelectedUser(null)
      setNote("")
      setSearchQuery("")
      onOpenChange(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Auftrag zuweisen</DialogTitle>
          <DialogDescription>Auftrag {orderId} einem Kollegen zuweisen</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Aktuelle Zuweisungen */}
          {currentAssignments.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Aktuell zugewiesen an:</Label>
              <div className="space-y-2">
                {currentAssignments.map((assignment, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={assignment.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{getInitials(assignment.user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{assignment.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{assignment.user.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {assignment.user.role}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
          )}

          {/* Benutzersuche */}
          <div className="space-y-2">
            <Label htmlFor="search">Kollegen suchen</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Name, E-Mail oder Rolle suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Benutzerliste */}
          <ScrollArea className="h-[200px] rounded-lg border">
            <div className="p-2 space-y-1">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                    selectedUser?.id === user.id ? "bg-primary/10 border border-primary" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}
                    />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </button>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Keine Benutzer gefunden</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Ausgewählter Benutzer */}
          {selectedUser && (
            <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Zuweisen an:</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedUser(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm">
                  Notiz (optional)
                </Label>
                <Textarea
                  id="note"
                  placeholder="Fügen Sie eine Notiz für den zugewiesenen Kollegen hinzu..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          {/* Zuweisungshistorie */}
          {currentAssignments.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Zuweisungshistorie
              </Label>
              <ScrollArea className="h-[120px] rounded-lg border">
                <div className="p-3 space-y-3">
                  {currentAssignments.map((assignment, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{assignment.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Zugewiesen von {assignment.assignedBy} am {assignment.assignedAt}
                      </p>
                      {assignment.note && (
                        <p className="text-xs text-muted-foreground mt-1 italic">"{assignment.note}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleAssign} disabled={!selectedUser}>
            Zuweisen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
