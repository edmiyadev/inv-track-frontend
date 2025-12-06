import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";
import type { User, Permission } from "@/lib/api/types";

// Define los tipos de acciones permitidas (mapeadas desde Laravel)
export type Actions = "manage" | "view" | "create" | "edit" | "delete" | "viewAny" | "syncRoles";

// Define los tipos de recursos/entidades (subjects)
export type Subjects =
  | "Dashboard"
  | "Purchase"
  | "Sale"
  | "Inventory"
  | "Product"
  | "Category"
  | "Supplier"
  | "User"
  | "Role"
  | "Settings"
  | "Warehouse"
  | "InventoryStock"
  | "InventoryMovement"
  | "all";

// Define el tipo de Ability
export type AppAbility = MongoAbility<[Actions, Subjects]>;

/**
 * Mapea el nombre del permiso de Laravel (formato: "resource.action")
 * a un objeto { action, subject } para CASL
 *
 * Ejemplos:
 * "products.view" -> { action: "view", subject: "Product" }
 * "suppliers.create" -> { action: "create", subject: "Supplier" }
 * "users.delete" -> { action: "delete", subject: "User" }
 */
function parsePermission(
  permissionName: string
): { action: Actions; subject: Subjects } | null {
  const [resource, action] = permissionName.split(".");

  if (!resource || !action) return null;

  // Mapear el nombre del recurso a Subject (primera letra mayúscula y singular)
  const subjectMap: Record<string, Subjects> = {
    dashboard: "Dashboard",
    products: "Product",
    categories: "Category",
    suppliers: "Supplier",
    users: "User",
    roles: "Role",
    settings: "Settings",
    purchasing: "Purchase",
    sales: "Sale",
    inventory: "Inventory",
    warehouses: "Warehouse",
    inventory_stocks: "InventoryStock",
    inventory_movements: "InventoryMovement",
  };

  // Mapear acción de Laravel a acción CASL
  const actionMap: Record<string, Actions> = {
    view: "view",
    create: "create",
    edit: "edit",
    update: "edit", // Alias para edit
    delete: "delete",
    manage: "manage",
  };

  const subject = subjectMap[resource] || (resource as Subjects);
  const mappedAction = actionMap[action] || (action as Actions);

  return { action: mappedAction, subject };
}

/**
 * Extrae todos los permisos únicos de los roles del usuario
 */
function extractPermissionsFromUser(user: User): Permission[] {
  if (!user.roles || user.roles.length === 0) {
    return [];
  }

  // Combinar todos los permisos de todos los roles
  const allPermissions = user.roles.flatMap((role) => role.permissions || []);

  // Eliminar duplicados basándose en el ID
  const uniquePermissions = allPermissions.filter(
    (permission, index, self) =>
      index === self.findIndex((p) => p.id === permission.id)
  );

  return uniquePermissions;
}

/**
 * Función para crear habilidades basadas en permisos del usuario
 */
export function defineAbilityFor(permissions: Permission[]): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  // Mapear cada permiso de Laravel a reglas CASL
  permissions.forEach((permission) => {
    const parsed = parsePermission(permission.name);

    if (parsed) {
      can(parsed.action, parsed.subject);

      // Si tiene permiso de "manage" en un recurso, dar todos los permisos
      if (parsed.action === "manage") {
        can("viewAny", parsed.subject);
        can("view", parsed.subject);
        can("create", parsed.subject);
        can("edit", parsed.subject);
        can("delete", parsed.subject);
      }
    }
  });

  return build();
}

/**
 * Función helper para crear habilidades desde el usuario completo
 */
export function createAbilityFromUser(user: User | null): AppAbility {
  if (!user) {
    // Usuario no autenticado - sin permisos
    return createMongoAbility<AppAbility>([]);
  }

  // Extraer permisos de todos los roles del usuario
  const permissions = extractPermissionsFromUser(user);

  return defineAbilityFor(permissions);
}

/**
 * Helper para verificar si un usuario tiene un rol específico
 */
export function hasRole(user: User | null, roleName: string): boolean {
  if (!user || !user.roles) return false;
  return user.roles.some(
    (role) => role.name.toLowerCase() === roleName.toLowerCase()
  );
}

/**
 * Helper para verificar si un usuario es admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, "Super Admin");
}

// Habilidad por defecto (sin permisos)
export const defaultAbility = createMongoAbility<AppAbility>([]);
