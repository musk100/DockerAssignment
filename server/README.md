# Assignments

✅ If CMD is not specified, the CMD of the base image will be executed. With no base image and no CMD, error will occur




<!-- story -->
✅ Build Docker image



<!-- first method -->
✅ Develop tar file, the other party will verify the hash. Hash will be included in text file, letting other party to verify with the hash we got

✅ if other side need extra node_modules, they will install it outside of airgap environment and then pull the repository from outside the airgap environment into the airgap environment 

✅ tar file (builder image) --> docker file is all inside the image, and adding more node_modules onto the builder image, then run the image in the 
container

<!-- other method -->
✅ add on source code in local repository and then do an npm install. 



<!-- Images -->
✅ Image is closed once the Dockerfile instructions are built

✅ When code is changed, images need to be rebuilt

✅ Images are layer-based (when building or rebuilding, only instructions where code is changed and all codes thereafter will be rebuilt)

✅ Every instruction in Dockerfile creates a layer in an image, and images are read-only. 

✅ If running a container-based on an image, that container adds a new layer on top of the image



<!-- Stopping and Restarting Containers -->
✅ docker --help (list of built-in docker commands)

✅ If dependencies, source code and image did not change, a container need not be created

✅ search for stopped containers with "docker ps -a" command

✅ Can restart a stopped container [docker start (container name)]

✅ verify running containers with "docker ps" command



<!-- Understanding attached and detached containers -->
✅ With "docker run ... " command, the container is running in the foreground, and therefore no other commands can be inserted thereafter (attached mode)

✅ With "docker start (container name)" command, the detached mode is the default

✅ In attached mode (docker run ...), the console log appears right below the "docker run ..." command because it is attached to the container 

✅ Attached mode means listening to the output of the container which is why the console shows in run and not start

✅ Adding "-d" in front of the container name in "docker run ..." command allows the container to be run in detached mode

✅ Using "docker container attach (container name)" can change a detached container to an attached container

✅ "docker log (container name)" allow us to view the past logs of a container



<!-- Deleting Images & Containers  -->
✅ Can run docker container prune to remove all stopped containers at once

✅ docker rm (container name) to remove containers one by one

✅ Can only remove images if they are not being used by any containers (Containers need to be removed first)

✅ docker image prune removes all images at once



<!-- Sharing Images & Containers -->
✅ Everyone who has an image, can create containers based on the image --> Share a Dockerfile, Share a built image

✅ Can push images to --> Docker Hub, Private Registry



<!-- Data and Volumes -->
✅ 