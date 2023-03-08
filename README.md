## Backup fall Simulator
This project is my second version of a highline backup fall simulator.

It is low tech so that it can run on any browser and be easily integrated to any website.
The only ressource that requires internet access is <a href="https://canvasjs.com/">Canvas</a> to make the graphs in the output. It could be made into a downloadable app. That is not its purpose though, the goal is to be able to explore _in advance_ to make decisions on the best way to rig.

At this stage however, it has <b>not been validated</b> by real experiments.

### How it works

layout.html file contains the general structure of the page. By opening this file you can run the simulation.

script-add-webbing.js handles the definition of the webbing types to be used.

script-configure-setup.js handles the construction of the setup.

script-do-the-maths.js gathers all the data from the form and performs the computations.

script-make-output.js creates the output for the user to see. It uses some assets from the assets folder

### The mathematical model

To find balance points, the model uses Newton's interpolation with the 2D force field.

To find the bottom of a fall, the model uses Newton's interpolation with the potential energy field in the vertical direction, and the force field in the horizontal direction.

### Next steps

I want to do real world tests to validate the model, or to know how much it is wrong. I believe it is a worst case fall every time - there is no loss of energy. But that has to be tested.

I will also eventually make a publication on how the model works, for the nerds out there.

There are a few functionnalities I'm already thinking about:
- Automatic tensioning of the line up to a desired tension (difficulty 2/10)
- Implementing real stretch curves for webbing instead of linear (model difficulty 1/10; UI difficulty: 8/10)

### Contact

Augustin Moinat - augustin@slacklineinternational.org