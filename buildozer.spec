[app]

# App information
title = MediTrack Clinic
package.name = meditrackclinic
package.domain = org.schoolproject
source.dir = .
source.include_exts = py,png,jpg,kv,atlas
version = 1.0

# Python requirements
requirements = python3,kivy==2.3.0

# Use a stable python-for-android release compatible with Kivy + Buildozer.
p4a.branch = v2024.01.21

# App display
orientation = portrait
fullscreen = 0

# Android options
android.permissions = INTERNET
android.api = 31
android.minapi = 21

[buildozer]
log_level = 2
warn_on_root = 1
