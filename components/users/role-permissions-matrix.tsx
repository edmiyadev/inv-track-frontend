import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from "lucide-react"

const permissions = [
  { feature: "View Dashboard", admin: true, manager: true, staff: true, viewer: true },
  { feature: "View Products", admin: true, manager: true, staff: true, viewer: true },
  { feature: "Create/Edit Products", admin: true, manager: true, staff: false, viewer: false },
  { feature: "Delete Products", admin: true, manager: true, staff: false, viewer: false },
  { feature: "View Inventory", admin: true, manager: true, staff: true, viewer: true },
  { feature: "Adjust Stock Levels", admin: true, manager: true, staff: true, viewer: false },
  { feature: "View Users", admin: true, manager: false, staff: false, viewer: false },
  { feature: "Manage Users", admin: true, manager: false, staff: false, viewer: false },
  { feature: "System Settings", admin: true, manager: false, staff: false, viewer: false },
  { feature: "Export Data", admin: true, manager: true, staff: false, viewer: false },
]

export function RolePermissionsMatrix() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Permissions Matrix</CardTitle>
        <CardDescription>Detailed breakdown of permissions for each role</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Feature</TableHead>
                <TableHead className="text-center">Administrator</TableHead>
                <TableHead className="text-center">Manager</TableHead>
                <TableHead className="text-center">Staff</TableHead>
                <TableHead className="text-center">Viewer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{permission.feature}</TableCell>
                  <TableCell className="text-center">
                    {permission.admin ? (
                      <Check className="mx-auto h-4 w-4 text-success" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {permission.manager ? (
                      <Check className="mx-auto h-4 w-4 text-success" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {permission.staff ? (
                      <Check className="mx-auto h-4 w-4 text-success" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {permission.viewer ? (
                      <Check className="mx-auto h-4 w-4 text-success" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
