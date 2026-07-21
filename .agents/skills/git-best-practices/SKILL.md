---
name: "git-best-practices"
description: "Git workflow best practices for Amanecer Rural projects. Branch strategy with main (production) + develop (integration) + feature branches. Small descriptive commits, cherry-pick releases, and changelog tracking. Use when making commits, creating branches, preparing releases, or reviewing git history."
---

# Git Best Practices — Amanecer Rural

## Branch Strategy

```
main            Producción (solo cherry-pick desde develop)
  └── develop   Integración (features se fusionan acá)
        ├── feature/*    (desde develop, se mergea a develop)
        ├── fix/*        (desde develop, se mergea a develop)
        └── chore/*      (desde develop, se mergea a develop)
```

| Rama | Propósito | ¿Se pusha? | ¿Quién mergea? |
|------|-----------|------------|----------------|
| `main` | Producción, solo código probado | Sí | TL vía PR |
| `develop` | Integración, features completos | Sí | Dev vía PR |
| `feature/*` | Una funcionalidad a la vez | Sí (respaldo) | Dev directo a develop |

## Commit Conventions

Usar **Conventional Commits**:

```
feat: agregar filtro por categoría en noticias
fix: corregir error 401 en refresh token
chore: actualizar dependencias NestJS
docs: agregar spec de testing infrastructure
refactor: extraer lógica de auth a servicio separado
test: agregar tests unitarios de RolesGuard
```

**Reglas:**
- Máximo 1 funcionalidad por commit
- Usar imperativo en presente ("agregar", no "agregó" ni "agrega")
- Descripción clara que explique el QUÉ, no el CÓMO
- Commits pequeños: si ves `y archivos varios` está mal

## Workflow Diario

### Iniciar una feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad
```

### Commits durante desarrollo
```bash
git add src/ruta/especifica.ts
git commit -m "feat: descripción clara del cambio"
```

### Terminar una feature
```bash
git checkout develop
git merge feature/nueva-funcionalidad
git branch -d feature/nueva-funcionalidad
git push origin develop
```

### Release a producción (cherry-pick)
```bash
# 1. Identificar hash del commit en develop
git log develop --oneline -10

# 2. Pasar a main y aplicar solo ese commit
git checkout main
git cherry-pick <hash-del-commit>

# 3. Pushear
git push origin main

# 4. Registrar en CHANGELOG
```

### Sincronizar develop con main
```bash
git checkout develop
git merge main
git push origin develop
```

## CHANGELOG

Mantener un archivo `CHANGELOG.md` en la raíz del proyecto:

```markdown
# Changelog

## [1.0.0] - 2025-07-20

### Added
- feat: auth module with JWT + roles (abc1234)
- feat: posts CMS module (def5678)

### Fixed
- fix: refresh token validation (ghi9012)
```

Cada entrada incluye el hash del commit cherry-picked a main.

## Protección de Ramas (GitHub Settings)

Configurar en GitHub → Settings → Branches:

### `main`
- [ ] Require pull request before merging
- [ ] Require approvals (1)
- [ ] Dismiss stale reviews
- [ ] Require status checks (tests pass)
- [ ] Include administrators

### `develop`
- [ ] Require pull request before merging
- [ ] Require approvals (1)
- [ ] Require status checks (tests pass)

## Buenas Prácticas Adicionales

1. **Nunca commitear .env, node_modules/ ni dist/**
2. **Pull antes de pushear**: `git pull --rebase origin develop`
3. **No force push en main o develop**
4. **Commits atómicos**: si necesitas revertir un cambio, que sea fácil
5. **Mensajes en español** (el equipo es hispanohablante)
6. **Issues y PRs descriptivos**: qué problema resuelve, cómo se probó
