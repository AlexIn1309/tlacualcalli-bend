# GUIA DE USO DE LA BASE DE DATOS

## PARA VER TODAS LAS TABLAS DE LA BASE DE DATOS EN LOCAL

- bunx wrangler d1 execute tlacualcalli-db --local --command="SELECT name FROM sqlite_master WHERE type='table';"

## VER ESTRUCTURA DETALLADA DE UNA TABLA

- bunx wrangler d1 execute tlacualcalli-db --local --command="PRAGMA table_info(tc_users);"

## VER EL COMANDO CREATE TABLE EXACTO DE UNA TABLA

- bunx wrangler d1 execute tlacualcalli-db --local --command="SELECT sql FROM sqlite_master WHERE type='table' AND name='tc_users';"
