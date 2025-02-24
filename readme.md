# Flayva

Flayva is a food-oriented social media web app, that combines the social emphasis of a social media app, with the detail of recipes provided by food blogs.

# Setup

### Node & pnpm

1. Download NodeJS (with npm) https://nodejs.org/en/download
1. Install pnpm package manager : `npm install -g pnpm`

### Project

1. clone this repository `git clone https://github.com/FlynnHillier/flayva.git`
1. open a terminal in the cloned directory `cd flayva`
1. install project dependencies `pnpm install`

### Enviroment

1. In both the `backend` & `frontend` folders replace `.env.example` with a file called `.env.local` filling in each variable specified appropriately
2. Values marked with a `?=` instead of a `=` are optional, however it is still recommended to specify them

### Shared folder

1. When changes have been made to the `shared` directory, run `pnpnm run build` while in the `shared` directory to build changes for access throughout the rest of the project

### Extras

1. Extra setup steps are specified in `backend/readme.md` & `frontend/readme.md` respectively

# Running

Once Setup is complete
