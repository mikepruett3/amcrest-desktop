# Amcrest Desktop

![AmcrestDesktop](https://github.com/mikepruett3/amcrest-desktop/blob/main/images/Amcrest.png?raw=true)

Amcrest Desktop is a simple Desktop application for viewing Amcrest NVR's, built using [ElectronJS](https://www.electronjs.org).

## Features

- Spell Check
- Remove Stored URL
- Control for Hardware Acceleration

## Installation

Dowload the latest [release](https://github.com/mikepruett3/amcrest-desktop/releases) for Windows, Linux and MacOS.

For Windows... a standard Exectuable is provided, as well as a NuGet package.

## Launching

To run, just launch the executable via the Desktop Shortcut, or the Executable directly.

## Building

To build locally, clone the repository and install the dependencies.

```powershell
git clone https://github.com/mikepruett3/amcrest-desktop.git
cd amcrest-desktop
npm install
```

To run the application locally.

```powershell
npm run test
```

To build the application installer.

```powershell
npm run make
```

## Dependencies

- electron
- electron-forge
- electron-store
- publisher-github

## Errata

Logo borrowed from [@AmcrestSecurity](https://twitter.com/AmcrestSecurity)