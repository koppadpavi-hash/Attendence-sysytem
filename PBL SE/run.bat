@echo off
title GM University - Student Attendance Management System
echo ============================================================
echo   GM UNIVERSITY, DAVANAGERE - ATTENDANCE MANAGEMENT SYSTEM
echo ============================================================
echo.
echo Launching Attendance Portal in your default web browser...
echo.

start "" "%~dp0index.html"

echo.
echo The portal is now open in your browser!
echo Location: %~dp0index.html
echo.
echo Demo Credentials:
echo   Administrator : admin / admin123
echo   Faculty       : rajesh.kumar / faculty123
echo   Student (Good): 4GM22CS054 / student123
echo   Student (Low) : 4GM22CS006 / student123 (Harsha V. - Low 75%% Alert)
echo.
echo Press any key to exit this launcher window...
pause >nul
