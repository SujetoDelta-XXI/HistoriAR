#!/bin/bash

# Script de verificación pre-deployment para HistoriAR
# Ejecutar antes de desplegar a producción

echo "🔍 Verificando preparación para deployment..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Verificar que .env no esté en Git
echo "📁 Verificando .gitignore..."
if git ls-files | grep -q "\.env$"; then
    echo -e "${RED}❌ ERROR: .env está en el repositorio Git${NC}"
    echo "   Ejecuta: git rm --cached backend/.env"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ .env no está en Git${NC}"
fi

# 2. Verificar que .env existe
echo ""
echo "📄 Verificando archivos .env..."
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ ERROR: backend/.env no existe${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ backend/.env existe${NC}"
fi

# 3. Verificar variables críticas
echo ""
echo "🔐 Verificando variables de entorno..."

if grep -q "MONGODB_URI=" backend/.env; then
    echo -e "${GREEN}✅ MONGODB_URI configurado${NC}"
else
    echo -e "${RED}❌ ERROR: MONGODB_URI no configurado${NC}"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "JWT_SECRET=" backend/.env; then
    if grep -q "JWT_SECRET=supersecreto" backend/.env; then
        echo -e "${YELLOW}⚠️  WARNING: JWT_SECRET usa valor por defecto${NC}"
        echo "   Genera uno nuevo para producción"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}✅ JWT_SECRET configurado${NC}"
    fi
else
    echo -e "${RED}❌ ERROR: JWT_SECRET no configurado${NC}"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "AWS_ACCESS_KEY_ID=" backend/.env; then
    echo -e "${GREEN}✅ AWS_ACCESS_KEY_ID configurado${NC}"
else
    echo -e "${RED}❌ ERROR: AWS_ACCESS_KEY_ID no configurado${NC}"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "ALLOWED_ORIGINS=" backend/.env; then
    echo -e "${GREEN}✅ ALLOWED_ORIGINS configurado${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: ALLOWED_ORIGINS no configurado${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# 4. Verificar node_modules
echo ""
echo "📦 Verificando dependencias..."
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Backend dependencies instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: Backend dependencies no instaladas${NC}"
    echo "   Ejecuta: cd backend && npm install"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "admin-panel/node_modules" ]; then
    echo -e "${GREEN}✅ Admin panel dependencies instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: Admin panel dependencies no instaladas${NC}"
    echo "   Ejecuta: cd admin-panel && npm install"
    WARNINGS=$((WARNINGS + 1))
fi

# 5. Verificar scripts
echo ""
echo "🔧 Verificando scripts..."
if [ -f "backend/scripts/checkEnvVars.js" ]; then
    echo -e "${GREEN}✅ Script de verificación existe${NC}"
else
    echo -e "${RED}❌ ERROR: Script de verificación no encontrado${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 6. Verificar documentación
echo ""
echo "📚 Verificando documentación..."
if [ -f "backend/docs/AWS_DEPLOYMENT_GUIDE.md" ]; then
    echo -e "${GREEN}✅ Guía de deployment existe${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: Guía de deployment no encontrada${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Resumen
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ TODO LISTO PARA DEPLOYMENT${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Generar nuevo JWT_SECRET para producción"
    echo "2. Crear credenciales AWS para producción"
    echo "3. Configurar ALLOWED_ORIGINS con URLs de producción"
    echo "4. Seguir guía en backend/docs/AWS_DEPLOYMENT_GUIDE.md"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  LISTO CON ADVERTENCIAS${NC}"
    echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
    echo ""
    echo "Revisa las advertencias antes de continuar"
    exit 0
else
    echo -e "${RED}❌ NO LISTO PARA DEPLOYMENT${NC}"
    echo -e "${RED}Errores: $ERRORS${NC}"
    echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
    echo ""
    echo "Corrige los errores antes de desplegar"
    exit 1
fi
