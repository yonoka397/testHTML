document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("drop-zone");
	const button = document.getElementById("button-image-upload");
	const file_input = document.getElementById("file-input");
	const upload_container = document.getElementById("upload-container");
	const upload_success_container = document.getElementById("upload-sucess-container");
	const button_image_reupload = document.getElementById("button-image-reupload");
    const preview = document.getElementById("preview");

    // 阻止瀏覽器的默認行為（打開文件）
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, e => e.preventDefault());
        document.body.addEventListener(eventName, e => e.preventDefault());
    });

    // 在拖放區添加 "dragover" 樣式
    ["dragenter", "dragover"].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add("dragover"));
    });

    // 移除 "dragover" 樣式
    ["dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove("dragover"));
    });

    // 當文件被拖放時觸發
    dropZone.addEventListener("drop", e => {
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
	
	button.addEventListener("click", () => {
		file_input.click();
	});
	
	file_input.addEventListener("change", () => {
		const files = file_input.files;
		handleFiles(files);
		
		file_input.value = "";
	});
	
	button_image_reupload.addEventListener("click", () => {
		showUploadContainer();
	});

    // 處理文件上傳
    function handleFiles(files) {
		let validFileFound = false;
        [...files].forEach(file => {
            if (file.type.startsWith("image/")) {
				validFileFound = true;
                const reader = new FileReader();
                reader.onload = () => {
					const existingImg = preview.querySelector("img");
					if (existingImg) {
						existingImg.src = reader.result;
					}
					else {
						const img = document.createElement("img");
						img.src = reader.result;
						preview.appendChild(img);
					}
                };
                reader.readAsDataURL(file);
				//uploadFile(file);
            } else {
                alert("Unsupport image format");
            }
        });
		
		if (validFileFound) {
			const previewRect = preview.getBoundingClientRect();
			const uploadContainerRect = upload_container.getBoundingClientRect();

			// 计算 upload-container 和 preview 的高度差
			const offset = uploadContainerRect.top - previewRect.top
				+ (previewRect.top - uploadContainerRect.bottom) - 20;
				//+ uploadSuccessTextHeight;

			// 设置 preview 的最终位置
			preview.style.transition = "transform 0.5s ease";
			preview.style.transform = `translateY(${offset}px)`;

			upload_container.classList.add("hidden");

			setTimeout(() => {
				upload_container.style.display = "none";
				
				preview.style.transition = "none"; // 移除动画以固定位置
				preview.style.transform = "translateY(0)"; // 确保位置归零
			}, 1000); // 动画时长与 CSS 保持一致
			upload_success_container.style.display = "block";
			setTimeout(() => {
				upload_success_container.classList.add("show");
			}, 1000);
			
		}
    }
	
	function showUploadContainer() {
		const previewRect = preview.getBoundingClientRect();
		const uploadSuccessContainerRect = upload_success_container.getBoundingClientRect();
		
		upload_container.style.visibility = "hidden"; // 不可见但保留空间
		upload_container.style.display = "block"; // 显示元素
		const uploadContainerHeight = upload_container.offsetHeight;
		upload_container.style.display = "none"; // 重新隐藏元素
		upload_container.style.visibility = "visible";
		console.log(uploadContainerHeight);
		
		const offset = (previewRect.top - uploadSuccessContainerRect.top) - uploadContainerHeight - 50;
			//+ (previewRect.top - uploadSuccessContainerRect.bottom);
				//uploadSuccessContainerRect.top - previewRect.top
		preview.style.transition = "transform 0.5s ease";
		preview.style.transform = `translateY(${-offset}px)`;
		

		upload_success_container.classList.remove("show");
		
		setTimeout(() => {
			
			upload_success_container.style.display = "none";
			upload_container.style.display = "block";
			
			preview.style.transition = "none"; // 移除动画以固定位置
			preview.style.transform = "translateY(0)"; // 确保位置归零
		}, 1000); // 动画时长与 CSS 保持一致
		
		setTimeout(() => {
			upload_container.classList.remove("hidden");
		}, 2000);
		
		
	}
});

function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    fetch("/upload", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => console.log("Upload successful:", data))
    .catch(error => console.error("Upload error:", error));
}

