# Calculadora de Faltas

PWA para calcular quantos dias um aluno pode faltar sem reprovar, com base nos dias letivos e no percentual mínimo de presença.

## Fórmula

```
faltas_permitidas = dias_letivos − ⌈dias_letivos × (presença_mínima / 100)⌉
```

## Stack

- Next.js 15 + TypeScript
- next-pwa (service worker + offline)
- CSS Modules

## Desenvolvimento

```bash
npm install
npm run dev
```

## Referência

LDB Art. 24 — frequência mínima de 75% do total de horas letivas para aprovação.
