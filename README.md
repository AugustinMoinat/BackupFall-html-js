## Backup fall Simulator
This project is my second version of a highline backup fall simulator.

It is low tech so that it can run on any browser and be easily integrated to any website.
The only ressource that requires internet access is <a href="https://canvasjs.com/">Canvas</a> to make the graphs in the output. It could be made into a downloadable app. That is not its purpose though, the goal is to be able to explore _in advance_ to make decisions on the best way to rig.

At this stage however, it has <b>not been validated</b> by real experiments.

### How it works

layout.html file contains the general structure of the page. By <a href="https://augustinmoinat.github.io/BackupFall-html-js/layout.html">opening this file</a> you can run the simulation.

script-add-webbing.js handles the definition of the webbing types to be used.

script-configure-setup.js handles the construction of the setup.

script-do-the-maths.js gathers all the data from the form and performs the computations.

script-make-output.js creates the output for the user to see. It uses some assets from the assets folder

### The mathematical model

To find balance points, the model uses Newton's interpolation with the 2D force field. 

To find the bottom of a fall, the model uses Newton's interpolation with the potential energy field in the vertical direction, and the force field in the horizontal direction.

Here's a <a href="https://augustinmoinat.github.io/BackupFall-html-js/Backup-fall%20simulator%20286b0f103f6742779e7860048e1a82d1.html">full explanation</a> of the maths and physics.

### Next steps

I want to do real world tests to validate the model, or to know how much it is wrong. I believe it is a worst case fall every time - there is no loss of energy. But that has to be tested.

There are a few functionnalities I'm already thinking about:
- Implementing real stretch curves for webbing instead of linear (model difficulty 1/10; UI difficulty: 8/10)
- Implementing real dynamics (stretch curves depend on stretch speed) - MASSIVE CHANGE, WOULD NEED A COMPLETELY NEW METHOD.

### Bug reports

If you find that the app returns results that seem weird to you, please tell me so I can have a look!

To reproduce the bug, I will need to know which webbings you are using, and what your setup is. Here's how to tell me exactly what I need to know:
- Save your webbings to browser memory
- Save your setup to browser memory
- In Devtools, go to Application/LocalStorage to see the values (Tuto: <a href="https://developer.chrome.com/docs/devtools/storage/localstorage/">Chrome</a>,<a href="https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/storage/localstorage">Edge</a>, <a href="https://firefox-source-docs.mozilla.org/devtools-user/storage_inspector/local_storage_session_storage/index.html">Firefox</a>). Make sure to be in the right tab after checking the tutorial.
- Webbings are under the key "myWebbings". Copy-paste that string.
- The set-up is under the key "mySetup<i>name_of_setup</i>". Copy paste also that string.
- Add all additional information: sections of mainline that fail, spot, tension (method, and left and right webbing pulled), highliner's characteristics.

### Contact

Augustin Moinat - augustin@slacklineinternational.org
