![Male Poon Logo](branding/malepoon_logo.jpg)

# Male Poon web browser

This is the source code for the Male Poon web browser, a nice poon browser derived from MoonchildProductions' Pale Moon/UXP code. The source tree is
laid out in a "comm-central" style configuration where only the code specific to our beloved Male Poon is kept in this repository.

The shared Unified XUL Platform-Fixed source code is referenced here as a git submodule contained in the `platform/` directory and is required to build the application.

Note: I have removed all proprietary Pale Moon branding. As such, this repository does not violate any copyrights imposed by Moonchild Productions. Any copyright claims submitted against this repo are false. In addition, the rights to the MPL licensed Pale Moon code cannot be revoked from me like they were from MyPal as I'm not distributing any binaries.

## Changes compared to Pale Moon:
* Branding changed from Pale Moon to Male Poon. kek.
* Restore dual GUID system/Firefox addons support
* Revert removal of ability to set extension update background URL (in case someone else starts their own addon site)

## FAQ
* Doesn't this violate Moonchild Productions' branding and copyrights?
    * No. Moonchild Productions owns (but has not legally registered) the copyright for Moonchild Productions and Pale Moon. He does not own the copyright for Male Poon, nor the copyright for ManchildProductions. On the Pale Moon forum Tobin claims that the blood moon logo cannot be used, even in goatse form. I am not using the blood moon logo from the Pale Moon repo. I am using a different picture of a blood moon pulled off of Google Images that is completely unrelated to their blood moon logo/branding. The font they used for the Pale Moon logo allows free commercial use. As such, I am not in violation of any branding. I'd be happy to take them to court to prove otherwise. I have the time and money to do so.
* Tobin seems to think you are someone named djames/Daniel James. Are you?
    * No. I have never met this person. My real name is Johann.

## Credits:
* MoonchildProductions for the wonderful Pale Moon Browser and UXP platform.
* Credits also go to Pale Moon and UXP contributors for the same as above.
* Palemoon.org forum users for continuing to report my profile. GitHub support has notified me that they will take note of the abuse of the GitHub reports feature and will act accordingly.
* mattatobin for continuing to complain about GitHub forks he doesn't like.

## Getting the platform sub-module
`git submodule init && git submodule update`

## Resources
TODO - Update these/golive with malepoon.org
 * [Build Pale Moon for Windows](https://developer.palemoon.org/build/windows/)
 * [Build Pale Moon for Linux](https://developer.palemoon.org/build/linux/)
 * [Pale Moon home page](http://www.palemoon.org/)
 * [Code of Conduct, Contributing, and UXP Coding style](https://repo.palemoon.org/MoonchildProductions/UXP/src/branch/master/docs)
