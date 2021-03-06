# How to use this image
# 
# The following instructions assume that you do not have Docker or Node
# installed on your computer. Instead, you will use the online Docker
# playground website 'Play With Docker (PWD)' to run the Theia browser example
# by just using PWD through your browser.
# 
# 1. First, open up http://labs.play-with-docker.com/ in your browser and
#    create a Play With Docker session and add a new instance to your Docker
#    playground.
# 
# 2. Next, you will need to download this Dockerfile into your PWD session with
#    wget.
# 
# $ wget https://raw.githubusercontent.com/theia-ide/theia/master/examples/browser/Dockerfile
# 
# 3. Next, ask Docker to build the image. This will take some time.
# 
# $ docker build -t theia .
# 
# 4. Now use Docker to run the image you just built.
# 
# $ docker run -d -p 0.0.0.0:3000:3000 theia
# 
# 5. There should now be a 3000 link at the top of your PWD window. Click on it
#    to try out the Theia browser example!
#    
#    Note that you may get an "Error forwarding request." error after clicking
#    on the 3000 link. Please wait a few seconds before trying again as Theia
#    may not have completely finished starting up yet.

FROM node:7.10
RUN useradd --create-home theia
USER theia
WORKDIR /home/theia
RUN git clone --depth 1 https://github.com/theia-ide/theia && \
    cd theia && \
    yarn
EXPOSE 3000
WORKDIR /home/theia/theia/examples/browser
CMD yarn run start
