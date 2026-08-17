(function () {
  const dialog = document.querySelector("[data-work-dialog]");
  const closeButton = document.querySelector("[data-dialog-close]");
  const expandButton = document.querySelector("[data-dialog-expand]");
  const image = document.querySelector("[data-dialog-image]");
  const lightbox = document.querySelector("[data-image-lightbox]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const lightboxVideo = document.querySelector("[data-lightbox-video]");
  const lightboxClose = document.querySelector("[data-lightbox-close]");
  const kicker = document.querySelector("[data-dialog-kicker]");
  const title = document.querySelector("[data-dialog-title]");
  const text = document.querySelector("[data-dialog-text]");
  const options = document.querySelectorAll("[data-detail-option]");
  const viewAllButtons = document.querySelectorAll("[data-view-all]");
  const allWorksDialog = document.querySelector("[data-all-works-dialog]");
  const allWorksClose = document.querySelector("[data-all-works-close]");
  const allWorksContent = document.querySelector("[data-all-works-content]");

  const folders = [
    {
      category: "3d",
      name: "UE Scene",
      title: "场景",
      text: "基于 UE 完成场景搭建、灯光组织与后期氛围调整，重点呈现空间层次和画面情绪。",
      featured: [
        "网页/3d/场景/ue灯光.webp",
        "网页/3d/场景/ue分形场景.jpg",
        "网页/3d/场景/ue后期处理场景.webp",
      ],
      media: [
        "网页/3d/场景/ue灯光.webp",
        "网页/3d/场景/ue分形场景.jpg",
        "网页/3d/场景/ue后期处理场景.webp",
      ],
    },
    {
      category: "3d",
      name: "Props",
      title: "道具",
      text: "覆盖风格化道具、硬表面武器与生物资产，强调造型完整度、材质质感和展示角度。",
      featured: [
        "网页/3d/道具/风格化箱 (1).webp",
        "网页/3d/道具/狙击枪 (1).webp",
        "网页/3d/道具/鸟.webp",
      ],
      media: [
        "网页/3d/道具/锤子 (2).png",
        "网页/3d/道具/锤子 (3).png",
        "网页/3d/道具/锤子 (4).webp",
        "网页/3d/道具/风格化箱 (1).webp",
        "网页/3d/道具/风格化箱 (2).webp",
        "网页/3d/道具/狙击枪 (1).webp",
        "网页/3d/道具/狙击枪 (2).png",
        "网页/3d/道具/鸟.webp",
      ],
    },
    {
      category: "3d",
      name: "UE Post FX",
      title: "UE 后期处理特效",
      text: "通过 UE 后期处理与动态演示强化画面节奏，让视觉效果在静帧和运动中保持统一。",
      featured: [
        "网页/3d/ue后期处理特效/ue后期处理特效_1.webp",
        "网页/3d/ue后期处理特效/ue后期处理特效_3.mp4",
      ],
      media: [
        "网页/3d/ue后期处理特效/ue后期处理特效_1.webp",
        "网页/3d/ue后期处理特效/ue后期处理特效_2.mp4",
        "网页/3d/ue后期处理特效/ue后期处理特效_3.mp4",
      ],
    },
    {
      category: "aigc",
      name: "AI Scene",
      title: "AI 辅助场景",
      text: "结合三维基础与 AI 生成能力进行场景概念扩展，用于快速建立氛围、构图和方向参考。",
      featured: [
        "网页/aigc/3d+ai辅助场景 (1).webp",
        "网页/aigc/3d+ai辅助场景 (2).webp",
      ],
      media: [
        "网页/aigc/3d+ai辅助场景 (1).webp",
        "网页/aigc/3d+ai辅助场景 (2).webp",
      ],
    },
    {
      category: "aigc",
      name: "AI Character",
      title: "AI 辅助角色设计",
      text: "围绕角色外观、比例、服饰和情绪进行 AI 辅助探索，为后续建模或视觉开发提供方向。",
      featured: [
        "网页/aigc/ai辅助角色设计 (2)_1.webp",
        "网页/aigc/ai辅助角色设计 (1)_2.webp",
        "网页/aigc/ai辅助角色设计 (1)_1.png",
      ],
      media: [
        "网页/aigc/ai辅助角色设计 (1).png",
        "网页/aigc/ai辅助角色设计 (1)_1.png",
        "网页/aigc/ai辅助角色设计 (1)_2.webp",
        "网页/aigc/ai辅助角色设计 (2).webp",
        "网页/aigc/ai辅助角色设计 (2)_1.webp",
      ],
    },
    {
      category: "aigc",
      name: "Minimax H3",
      title: "ai动画",
      text: "使用 AI 视频与动态图形工具完成短片实验，关注节奏、镜头转换和视觉识别度。",
      featured: [
        "网页/aigc/minimaxH3_二维动画1.mp4",
      ],
      media: [
        "网页/aigc/minimaxH3_MG动画1.web.mp4",
        "网页/aigc/minimaxH3_标题动画1.web.mp4",
        "网页/aigc/minimaxH3_二维动画1.mp4",
        "网页/aigc/sd纯文字.mp4",
      ],
    },
  ];

  let currentFolderIndex = 0;

  if (!dialog || !image || !kicker || !title || !text) {
    return;
  }

  function isVideo(src) {
    return /\.(mp4|mkv|webm)$/i.test(src);
  }

  function mediaMarkup(src, alt) {
    if (isVideo(src)) {
      return `<video muted loop playsinline preload="metadata" data-media-element data-lazy-video><source src="${src}" /></video>`;
    }

    return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" data-media-element />`;
  }

  function setupLazyVideos(scope = document) {
    const videos = Array.from(scope.querySelectorAll("[data-lazy-video]"));
    if (!videos.length || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting && !document.querySelector("dialog[open]")) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "120px 0px", threshold: 0.2 }
    );

    videos.forEach((video) => observer.observe(video));
  }

  function pausePreviewVideos() {
    document.querySelectorAll("[data-lazy-video]").forEach((video) => video.pause());
  }

  function renderGalleries() {
    document.querySelectorAll("[data-gallery-category]").forEach((gallery) => {
      const category = gallery.dataset.galleryCategory;
      const categoryFolders = folders
        .map((folder, folderIndex) => ({ ...folder, folderIndex }))
        .filter((folder) => folder.category === category);
      const displayItems = [];
      const maxFeaturedCount = Math.max(...categoryFolders.map((folder) => (folder.featured || folder.media).length));

      for (let itemIndex = 0; itemIndex < maxFeaturedCount; itemIndex += 1) {
        categoryFolders.forEach((folder) => {
          const sourceList = folder.featured || folder.media;
          const src = sourceList[itemIndex];
          if (src) {
            displayItems.push({ folder, src });
          }
        });
      }

      const cards = displayItems
        .map(({ folder, src }) => {
          const mediaIndex = folder.media.indexOf(src);
          return `
                    <button class="bounce-card card-${folder.folderIndex}" type="button" data-work-card data-work-index="${folder.folderIndex}" data-media-index="${mediaIndex}" data-media-src="${src}" aria-label="放大查看 ${folder.title} ${mediaIndex + 1}">
                      ${mediaMarkup(src, `${folder.title} ${mediaIndex + 1}`)}
                      <span class="media-tag">${folder.title}</span>
                      <span class="zoom-chip" data-card-zoom aria-label="放大查看" title="放大查看"></span>
                    </button>
                  `;
        })
        .join("");

      gallery.innerHTML = cards;
    });
  }

  function showModal(modal) {
    if (!modal) {
      return;
    }

    try {
      if (typeof modal.showModal === "function" && !modal.open) {
        modal.showModal();
        syncDialogCursor();
        return;
      }
      modal.setAttribute("open", "");
      syncDialogCursor();
    } catch (error) {
      modal.setAttribute("open", "");
      syncDialogCursor();
    }
  }

  function syncDialogCursor() {
    const hasOpenDialog = Boolean(document.querySelector("dialog[open]"));
    document.body.classList.toggle("dialog-cursor-visible", hasOpenDialog);
  }

  function closeDialog(modal) {
    if (!modal?.open) {
      return;
    }

    modal.close();
    syncDialogCursor();
  }

  function openLightbox(src) {
    if (!src || !lightbox || !lightboxImage || !lightboxVideo) {
      return;
    }

    closeDialog(dialog);
    closeDialog(allWorksDialog);

    if (isVideo(src)) {
      lightboxImage.hidden = true;
      lightboxImage.removeAttribute("src");
      lightboxVideo.hidden = false;
      lightboxVideo.src = src;
      lightboxVideo.load();
      lightboxVideo.currentTime = 0;
    } else {
      lightboxVideo.pause();
      lightboxVideo.hidden = true;
      lightboxVideo.removeAttribute("src");
      lightboxImage.hidden = false;
      lightboxImage.src = src;
    }

    showModal(lightbox);
    pausePreviewVideos();
  }

  function setDetail(mediaIndex) {
    const folder = folders[currentFolderIndex] || folders[0];
    const selectedMedia = folder.media[mediaIndex] || folder.media[0];
    image.src = isVideo(selectedMedia) ? folder.media.find((src) => !isVideo(src)) || "" : selectedMedia;
    kicker.textContent = folder.name;
    title.textContent = folder.title;
    text.textContent = `${folder.text} 当前查看：${selectedMedia}`;

    options.forEach((option) => {
      const index = Number(option.dataset.index);
      option.classList.toggle("is-active", index === mediaIndex);
      option.textContent = folder.media[index] ? `Media ${index + 1}` : "";
      option.hidden = !folder.media[index];
    });
  }

  function renderAllWorks(category) {
    if (!allWorksContent) {
      return;
    }

    allWorksContent.innerHTML = folders
      .filter((folder) => !category || folder.category === category)
      .map(
        (folder, folderIndex) => `
          <section class="all-works-group">
            <h3>${folder.title}</h3>
            <div class="all-works-grid">
              ${folder.media
                .map(
                  (src, mediaIndex) => `
                    <button class="all-works-item" type="button" data-all-work-media="${src}" data-folder-index="${folderIndex}" data-media-index="${mediaIndex}" aria-label="放大查看 ${folder.title} ${mediaIndex + 1}">
                      ${mediaMarkup(src, `${folder.title} ${mediaIndex + 1}`)}
                      <span>${isVideo(src) ? "Video" : "Image"}</span>
                    </button>
                  `
                )
                .join("")}
            </div>
          </section>
        `
      )
      .join("");
  }

  renderGalleries();
  setupLazyVideos();

  function openAllWorks(category) {
    renderAllWorks(category);
    setupLazyVideos(allWorksContent);
    pausePreviewVideos();
    showModal(allWorksDialog);
  }

  document.addEventListener("click", (event) => {
    const viewAllTrigger = event.target.closest("[data-view-all]");
    if (viewAllTrigger) {
      event.preventDefault();
      event.stopPropagation();
      openAllWorks(viewAllTrigger.dataset.viewCategory);
      return;
    }

    const allWorkMedia = event.target.closest("[data-all-work-media]");
    if (allWorkMedia) {
      event.preventDefault();
      event.stopPropagation();
      openLightbox(allWorkMedia.dataset.allWorkMedia);
      return;
    }

    const card = event.target.closest("[data-work-card]");
    const zoomTrigger = event.target.closest("[data-card-zoom], [data-media-element], [data-zoomable]");
    if (zoomTrigger) {
      const src = card?.dataset.mediaSrc || zoomTrigger.getAttribute("src");
      event.preventDefault();
      event.stopPropagation();
      openLightbox(src);
      return;
    }

    if (!card) {
      return;
    }

    currentFolderIndex = Number(card.dataset.workIndex);
    setDetail(Number(card.dataset.mediaIndex) || 0);
    pausePreviewVideos();
    showModal(dialog);
  });

  options.forEach((option) => {
    option.addEventListener("click", () => setDetail(Number(option.dataset.index)));
  });

  viewAllButtons.forEach((viewAllButton) =>
    viewAllButton.addEventListener("click", () => {
      openAllWorks(viewAllButton.dataset.viewCategory);
    })
  );

  allWorksClose?.addEventListener("click", () => closeDialog(allWorksDialog));
  allWorksDialog?.addEventListener("click", (event) => {
    if (event.target === allWorksDialog) {
      closeDialog(allWorksDialog);
    }
  });

  [dialog, lightbox, allWorksDialog].forEach((modal) => {
    modal?.addEventListener("close", syncDialogCursor);
  });

  function resetDialogSize() {
    dialog.classList.remove("is-expanded");
    if (expandButton) {
      expandButton.textContent = "Expand";
      expandButton.setAttribute("aria-label", "展开详情页");
    }
  }

  closeButton?.addEventListener("click", () => {
    resetDialogSize();
    closeDialog(dialog);
  });

  expandButton?.addEventListener("click", () => {
    const isExpanded = dialog.classList.toggle("is-expanded");
    expandButton.textContent = isExpanded ? "Collapse" : "Expand";
    expandButton.setAttribute("aria-label", isExpanded ? "收起详情页" : "展开详情页");
  });

  lightboxClose?.addEventListener("click", () => closeDialog(lightbox));
  lightbox?.addEventListener("close", () => {
    lightboxVideo?.pause();
  });
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeDialog(lightbox);
    }
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      resetDialogSize();
      closeDialog(dialog);
    }
  });
})();

