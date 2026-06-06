@echo off
mkdir frontend
move src frontend\
move package.json frontend\
move package-lock.json frontend\
move vite.config.js frontend\
move index.html frontend\
move node_modules frontend\
del move2.bat
