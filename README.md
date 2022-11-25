# Linux Search Everything

<img src="https://user-images.githubusercontent.com/37028825/166054685-9f56c077-52c2-4af1-ba6b-a2e87cde847b.png" height="140"/>

A faster and more flexible file browser for <strong>Linux</strong>, offering rich capabilities such as case sensitivity, <strong>regular expression</strong> based search, search by selecting multiple file types, selection of <strong>BFS algorithms</strong> based on multi threads, control of how deep the algorithms go, choice of custom files to not be taking into account in the search process to improve the search speed and more features.
<br/>
<br/>
![1-home-view](https://user-images.githubusercontent.com/37028825/166050292-9f306649-1593-48b2-96f4-4a1933ccc9b3.png)

## Stack selected and architecture

It was made using the [Electron framework](https://www.electronjs.org/). The UI was created with [Reactjs](https://reactjs.org/) version 18, using the new concurrency capabilities in this new release. [Redux](https://redux.js.org/) library was used as the global state feature.

For the features related to file search and shell command execution, [Nodejs](https://nodejs.org/) was used.The project is in the process of getting started, my goal is to achieve the capabilities of the windows "everything" software.
In this version we are not using indexing. But we are exploiting the multitasking capabilities offered by Nodejs to try to perform a search in the file tree as fast as possible. I use [child_process](https://nodejs.org/docs/latest-v17.x/api/child_process.html), [spawn](https://nodejs.org/docs/latest-v17.x/api/child_process.html#child_processspawncommand-args-options), [fork](https://nodejs.org/docs/latest-v17.x/api/child_process.html#child_processforkmodulepath-args-options), and [worker_threads](https://nodejs.org/docs/latest-v17.x/api/worker_threads.html).

### Software Architecture

Electron is a framework for building desktop applications using JavaScript, HTML, and CSS. By embedding Chromium and Node.js into its binary, Electron allows you to maintain one JavaScript codebase and create cross-platform apps that work on Windows, macOS, and Linux — no native development experience required.
It has two main processes, IcpMain and IcpRender. IcpMain is a node base environment where all Nodejs functionalities such as path, fs, EventEmitter, child_process, worker_threads, etc. can be accessed.
IcpRender is in charge of the render ui.

![basic-arch](https://user-images.githubusercontent.com/37028825/166067519-6174d01b-6d02-4d9d-a1c1-51d8fb414e00.png)

I've implemented a multi threading BFS for search in the File System Tree.

### Search Algorithms

![g124567](https://user-images.githubusercontent.com/37028825/166061379-3096c3b1-c01e-4392-b04e-a8da534eeaa3.png)

## Application Gallery

### Basic Search UI

![1-home-view](https://user-images.githubusercontent.com/37028825/166068695-f432b357-ecca-4109-ab01-73c2d6b7694e.png)

### Directories Edition

![2-selection-directories_1](https://user-images.githubusercontent.com/37028825/166068798-168b799e-d04b-412e-b873-88aa6475ba3b.png)

### Directories Selection

![2-selection-directories_2](https://user-images.githubusercontent.com/37028825/166068914-d7f4e180-fead-476a-b09f-fae90f65068c.png)

### Search Filtering Capabilities

![3-settings-to-improve-the-search](https://user-images.githubusercontent.com/37028825/166069077-12a5f560-3614-4501-a8cf-350a31549a6e.png)

### Result of getting all the videos for the dir: "/mnt/DATA"

![4-result-image-video-files](https://user-images.githubusercontent.com/37028825/166069179-63bd13f3-6998-4915-aa35-d64cc0125d5a.png)

### Search based on regular expression

![6-result-matching](https://user-images.githubusercontent.com/37028825/166069379-0f321e48-6916-4a46-b098-65a39937507b.png)

## Installers

<https://drive.google.com/drive/folders/1BBPZhR-4YVGxHIWIV_JBFh-GS5-TREDv?usp=sharing>

### get the .deb package

<https://drive.google.com/uc?id=1fHTbuU4ADu8ABc0QQGqzLms2h31dyXeU&export=download>

### get the .rpm package

<https://drive.google.com/uc?id=15q_scY6eqB46XzNesJKxUopLk0ibmXAv&export=download>

### get the .zip package

<https://drive.google.com/uc?id=1ssHkG142tZVPKv8cUMFAbmILDup-Waoy&export=download>

## Useful commands

To see slug problems with the .snap package and to see the recommendations

```
sudo journalctl --output=short --follow --all | sudo snappy-debug -r
```

## Youtube Video
[![main video](https://user-images.githubusercontent.com/37028825/166125854-573fdbff-f9cc-4e2c-ac1f-dd7f22100f7a.png)](https://youtu.be/6iVXQYM4GPg)
