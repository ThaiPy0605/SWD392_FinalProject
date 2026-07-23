@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Script
@REM ----------------------------------------------------------------------------

@if "%DEBUG%"=="4" @echo on
@setlocal enableextensions enabledelayedexpansion

if not "%JAVA_HOME%"=="" goto setJavaHome
set "JAVA_HOME=C:\Program Files\Android\openjdk\jdk-21.0.8"

:setJavaHome
if exist "%JAVA_HOME%\bin\java.exe" goto foundJava
echo JAVA_HOME is set to an invalid directory: "%JAVA_HOME%"
goto error

:foundJava
set "JAVACMD=%JAVA_HOME%\bin\java.exe"
set "MAVEN_PROJECTBASEDIR=%~dp0"
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

"%JAVACMD%" -classpath "%WRAPPER_JAR%" "-Dmaven.home=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %*
if ERRORLEVEL 1 goto error
goto end

:error
exit /B 1

:end
exit /B 0
