document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("drop-zone");
	const button = document.getElementById("button_image_upload");
	const file_input = document.getElementById("file_input");
	const file_upload_text = document.getElementById("upload_success_text");
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
	});

    // 處理文件上傳
    function handleFiles(files) {
		let validFileFound = false;
        [...files].forEach(file => {
            if (file.type.startsWith("image/")) {
				validFileFound = true;
                const reader = new FileReader();
                reader.onload = () => {
                    const img = document.createElement("img");
                    img.src = reader.result;
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
				//uploadFile(file);
            } else {
                alert("Unsupport image format");
            }
        });
		
		if (validFileFound) {
			dropZone.style.display = "none";
			button.style.display = "none";
			file_upload_text.style.display = "block";
		}
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

