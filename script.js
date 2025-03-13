const loadCategories = async () => {
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/phero-tube/categories"
    );
    const data = await response.json();
   displayCategories(data.categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const loadCategoryVideos = async id => {
     try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/category/${id}`
         );
    const data = await response.json();
   displayVideos(data.category);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

const displayCategories = categories => {
    const categoryContainer = document.getElementById("category-container");
    categories.forEach(category => {
        const categoryDiv = document.createElement('div')
        categoryDiv.innerHTML = `
    <button onclick='loadCategoryVideos(${category.category_id})' class="btn btn-sm hover:bg-[#FF1F3D]  hover:text-white">${category.category}</button>
    `;
        categoryContainer.append(categoryDiv)
    });

}

const loadVideos = async () => {
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/phero-tube/videos"
    );
    const data = await response.json();
   displayVideos(data.videos);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const displayVideos = videos => {
    const videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = ''

    videos.forEach(video => {
        const videoDiv = document.createElement('div')
        videoDiv.innerHTML = `
           <div class="card bg-base-100">
        <figure class="relative">
          <img class="w-full h-[150px] object-cover" src="${
            video.thumbnail
          }" alt="Shoes" />
          <span
            class="absolute bottom-2 right-2 text-sm rounded text-white bg-black px-2"
            >3hrs 56 min ago</span
          >
        </figure>

        <div class="flex gap-3 px-0 py-5">
          <div class="profile">
            <div class="avatar">
              <div
                class="ring-primary ring-offset-base-100 w-6 rounded-full ring ring-offset-2"
              >
                <img
                  src="${video.authors[0].profile_picture}"
                />
              </div>
            </div>
          </div>

          <div class="intro">
            <h2 class="text-sm font-semibold">Midnight Serenade</h2>
            <p class="text-sm text-gray-400 flex gap-1">
             ${video.authors[0].profile_name}
              ${
                video.authors[0].verified == true
                  ? `<img
                class="w-5 h-5"
                src="https://img.icons8.com/?size=96&id=98A4yZTt9abw&format=png"
                alt=""
              />`
                  : ``
              }
            </p>
            <p class="text-sm text-gray-400">${video.others.views} views</p>
          </div>

        </div>
        <button class="btn btn-block">Show Details</button>
      </div>
        `;
         videoContainer.append(videoDiv);
    })
}
    
    
    
    

loadCategories()