# Nemuri MVP

Base inicial para una plataforma de acompanamiento a padres con bebes enfocada en sueno, rutina, alimentacion y desarrollo.

## Estructura

- `apps/web`: experiencia web para padres + panel profesional MVP
- `apps/mobile`: base React Native Expo con experiencia mobile MVP

## Ejecutar web

```bash
npm.cmd --workspace apps/web run dev
```

Luego abre la URL que muestre Vite, normalmente `http://localhost:5173`.

## Ejecutar mobile

```bash
npm install
npm run dev:mobile
```

Luego abre Expo Go o ejecuta version web con:

```bash
npm --workspace apps/mobile run web
```
