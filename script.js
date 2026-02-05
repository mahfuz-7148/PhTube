// API Base URL
const API_BASE = "https://openapi.programming-hero.com/api/phero-tube";

// Global state
let currentVideos = [];
let isSortedByViews = false;

// Utility Functions
const showLoader = () => {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("video-container").classList.add("hidden");
};

const hideLoader = () => {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("video-container").classList.remove("hidden");
};

// Format time ago
const formatTimeAgo = (seconds) => {
  if (!seconds) return "Recently uploaded";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (hours > 0) {
    return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min ago`;
  }
  return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
};

// Format views count
const formatViews = (views) => {
  if (!views) return "0 views";

  const num = parseInt(views);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }
  return `${num} views`;
};

// Remove active class from all buttons
const removeActiveClass = () => {
  const activeBtns = document.querySelectorAll(".category-btn-active");
  activeBtns.forEach((btn) => {
    btn.classList.remove(
      "bg-gradient-primary",
      "shadow-md",
      "shadow-[#ff1f3d]/30",
      "category-btn-active"
    );
    btn.classList.add("bg-[#151520]", "border", "border-[#2a2a3e]", "text-gray-300");
  });
};

// Load Categories
const loadCategories = async () => {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    const data = await response.json();
    displayCategories(data.categories);
  } catch (error) {
    console.error("Error loading categories:", error);
    showNotification("Failed to load categories", "error");
  }
};

// Display Categories
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.id = `btn-${category.category_id}`;
    button.className =
      "px-6 py-2.5 bg-[#151520] border border-[#2a2a3e] text-gray-300 font-medium rounded-full whitespace-nowrap hover:border-[#ff1f3d] hover:text-white hover:-translate-y-0.5 transition-all duration-300";
    button.textContent = category.category;
    button.onclick = () => loadCategoryVideos(category.category_id);

    categoryContainer.appendChild(button);
  });
};

// Load Category Videos
const loadCategoryVideos = async (categoryId) => {
  showLoader();

  try {
    const response = await fetch(`${API_BASE}/category/${categoryId}`);
    const data = await response.json();

    removeActiveClass();
    const clickedButton = document.getElementById(`btn-${categoryId}`);
    if (clickedButton) {
      clickedButton.classList.remove("bg-[#151520]", "border", "border-[#2a2a3e]", "text-gray-300");
      clickedButton.classList.add(
        "bg-gradient-primary",
        "shadow-md",
        "shadow-[#ff1f3d]/30",
        "category-btn-active"
      );
    }

    displayVideos(data.category);
  } catch (error) {
    console.error("Error loading category videos:", error);
    showNotification("Failed to load videos", "error");
  } finally {
    hideLoader();
  }
};

// Load All Videos
const loadVideos = async (searchText = "") => {
  showLoader();

  try {
    const response = await fetch(`${API_BASE}/videos?title=${searchText}`);
    const data = await response.json();

    removeActiveClass();
    const allButton = document.getElementById("btn-all");
    if (allButton) {
      allButton.classList.remove("bg-[#151520]", "border", "border-[#2a2a3e]", "text-gray-300");
      allButton.classList.add(
        "bg-gradient-primary",
        "shadow-md",
        "shadow-[#ff1f3d]/30",
        "category-btn-active"
      );
    }

    displayVideos(data.videos);
  } catch (error) {
    console.error("Error loading videos:", error);
    showNotification("Failed to load videos", "error");
  } finally {
    hideLoader();
  }
};

// Display Videos
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";

  // Store videos globally
  currentVideos = videos || [];

  if (!videos || videos.length === 0) {
    videoContainer.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <img src="Icon.png" alt="No content" class="w-32 opacity-50 mb-6" />
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">No Content Found</h2>
        <p class="text-gray-400 text-lg">Try searching for something else or browse different categories</p>
      </div>
    `;
    return;
  }

  videos.forEach((video, index) => {
    const videoCard = createVideoCard(video, index);
    videoContainer.appendChild(videoCard);
  });
};

// Create Video Card
const createVideoCard = (video, index) => {
  const card = document.createElement("div");
  card.className = "card-hover bg-[#151520] border border-[#2a2a3e] rounded-2xl overflow-hidden animate-fade-in-up";
  card.style.animationDelay = `${index * 0.1}s`;

  const timeAgo = formatTimeAgo(video.others?.posted_date);
  const views = formatViews(video.others?.views);
  const isVerified = video.authors?.[0]?.verified === true;

  card.innerHTML = `
    <div class="relative h-52 bg-[#0a0a0f] overflow-hidden">
      <img 
        src="${video.thumbnail}" 
        alt="${video.title || "Video thumbnail"}"
        loading="lazy"
        class="w-full h-full object-cover img-scale"
      />
      <span class="absolute bottom-3 right-3 px-3 py-1.5 bg-black/85 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">
        ${timeAgo}
      </span>
    </div>

    <div class="p-4">
      <h3 class="text-base font-semibold text-white mb-3 line-clamp-2 leading-snug">
        ${video.title || "Untitled Video"}
      </h3>

      <div class="flex items-center gap-3 mb-2">
        <img 
          class="w-9 h-9 rounded-full border-2 border-[#ff1f3d]" 
          src="${video.authors?.[0]?.profile_picture || ""}" 
          alt="${video.authors?.[0]?.profile_name || "Author"}"
        />
        <div class="flex items-center gap-2 flex-wrap text-sm text-gray-400">
          <span>${video.authors?.[0]?.profile_name || "Unknown"}</span>
          ${
    isVerified
      ? `<img 
                  class="w-4 h-4" 
                  src="https://img.icons8.com/?size=96&id=98A4yZTt9abw&format=png" 
                  alt="Verified"
                />`
      : ""
  }
        </div>
      </div>

      <p class="text-sm text-gray-400 mb-4">${views}</p>

      <button 
        onclick="showDetailsModal('${video.video_id}')"
        class="w-full px-4 py-2.5 bg-transparent border border-[#2a2a3e] text-gray-300 font-medium rounded-lg hover:bg-[#ff1f3d] hover:border-[#ff1f3d] hover:text-white transition-all duration-300"
      >
        View Details
      </button>
    </div>
  `;

  return card;
};

// Show Details Modal
const showDetailsModal = async (videoId) => {
  try {
    const response = await fetch(`${API_BASE}/video/${videoId}`);
    const data = await response.json();
    const video = data.video;

    const modalContainer = document.getElementById("modal-container");
    modalContainer.innerHTML = `
      <dialog id="details_modal" class="modal backdrop-blur-sm">
        <div class="modal-box bg-[#151520] border border-[#2a2a3e] rounded-2xl max-w-2xl">
          <h3 class="text-2xl font-bold text-white mb-4">
            ${video.title || "Video Details"}
          </h3>
          
          <img 
            class="w-full max-w-md rounded-xl mb-4 mx-auto" 
            src="${video.thumbnail}" 
            alt="${video.title || "Video thumbnail"}"
          />
          
          <p class="text-gray-300 leading-relaxed mb-6">
            ${video.description || "No description available."}
          </p>
          
          <div class="modal-action">
            <form method="dialog">
              <button class="px-6 py-2.5 bg-[#ff1f3d] text-white font-semibold rounded-lg hover:bg-[#d91932] transition-all duration-300">
                Close
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    `;

    document.getElementById("details_modal").showModal();
  } catch (error) {
    console.error("Error loading video details:", error);
    showNotification("Failed to load video details", "error");
  }
};

// Show Notification (Simple Toast)
const showNotification = (message, type = "info") => {
  const toast = document.createElement("div");
  const bgColor = type === "error" ? "bg-[#ff1f3d]" : "bg-green-500";

  toast.className = `fixed top-5 right-5 ${bgColor} text-white px-6 py-4 rounded-xl font-semibold shadow-2xl z-[9999] animate-fade-in-up`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Sort Videos by Views
const sortVideosByViews = () => {
  if (!currentVideos || currentVideos.length === 0) {
    showNotification("No videos to sort", "error");
    return;
  }

  isSortedByViews = !isSortedByViews;

  const sortedVideos = [...currentVideos].sort((a, b) => {
    const viewsA = parseInt(a.others?.views || 0);
    const viewsB = parseInt(b.others?.views || 0);
    return isSortedByViews ? viewsB - viewsA : 0;
  });

  displayVideos(sortedVideos);

  const message = isSortedByViews
    ? "Sorted by views (highest first)"
    : "Showing original order";
  showNotification(message, "info");
};

// Search Input Handler
const setupSearch = () => {
  const searchInput = document.getElementById("searchInput");
  let searchTimeout;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      const searchText = e.target.value.trim();
      loadVideos(searchText);
    }, 500);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      loadVideos();
    }
  });
};

// Initialize App
const initApp = async () => {
  try {
    setupSearch();
    await loadCategories();
    await loadVideos();
  } catch (error) {
    console.error("Error initializing app:", error);
    showNotification("Failed to initialize app", "error");
  }
};

// ❌ REMOVE THIS ENTIRE BLOCK - Not needed with defer!
// if (document.readyState === "loading") {
//   document.addEventListener("DOMContentLoaded", initApp);
// } else {
//   initApp();
// }

// ✅ Just call directly - defer guarantees DOM is ready
initApp();

// Add fadeOut animation
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);