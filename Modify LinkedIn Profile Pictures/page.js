const newProfilePicturePath = "cat-image.jpg";

// Utility functions
// This function replaces the profile picture with the new image
const replaceProfilePicture = (pic) => {
  console.log("Replacing image:", pic.src);
  pic.src = "cat-image.jpg";
  pic.srcset = `${chrome.runtime.getURL(newProfilePicturePath)}`;
  pic.setAttribute("loading", "eager");
};

// This higher-order function takes a callback function and returns a new function
// The returned function checks if the given node is an element with querySelectorAll support
// If so, it applies the callback function to each of the matching img.ember-view elements
const observeNode = (callback) => (node) => {
  if (node.nodeType === 1 && node.querySelectorAll) {
    const pics = node.querySelectorAll("img.ember-view");
    pics.forEach(callback);
  }
};

// Main functions
// This function replaces all the existing profile pictures
const replaceExistingProfilePictures = () => {
  const profilePictures = document.querySelectorAll("img.ember-view");
  console.log(`Found ${profilePictures.length} profile pictures`);
  profilePictures.forEach(replaceProfilePicture);
};

// This function sets up a MutationObserver to watch for new nodes being added to the DOM
// Whenever new nodes are added, it uses the observeNode function to apply the replaceProfilePicture function to any new img.ember-view elements
const observeNewProfilePictures = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(observeNode(replaceProfilePicture));
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

// Initialize the profile picture replacement
replaceExistingProfilePictures();
observeNewProfilePictures();
