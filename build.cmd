@echo Off
REM variables

set solutionName=TAlex.MathCore.sln
set buildDir=Build
set packagesDir=%buildDir%\packages

REM process

mkdir %buildDir%
mkdir %packagesDir%

nuget.exe pack MarkdownEditorShell.nuspec -OutputDirectory %packagesDir%
