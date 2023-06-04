const postLimit = 10;
const path = "http://www.reddit.com/r/singapore/new.json?sort=new";
const placeHolderImage = "https://placekitten.com/640/360";

async function fetchData() {
    const res = await fetch(path);
    const record = await res.json();
    for (var i = 0; i < postLimit; i++) {
        var card = document.createElement("div");
        var content = document.createElement("div");
        var title = document.createElement("b");
        title.textContent = `${record.data.children[i].data.title}`;
        var paragraph = document.createElement("p");
        if (record.data.children[i].data.selftext.length > 150) {
            paragraph.textContent = `${record.data.children[i].data.selftext.slice(0, 150) + '...'}`;
        } else {
            paragraph.textContent = `${record.data.children[i].data.selftext}`;
        }

        if (record.data.children[i].data.url_overridden_by_dest) {
            var link = document.createElement("a");
            link.href = `${"https://www.reddit.com" + record.data.children[i].data.permalink}`;
            link.setAttribute('target', '_blank');
            var linkText = document.createTextNode("Comments");

            var eLink = document.createElement("a");
            eLink.href = `${record.data.children[i].data.url}`;
            eLink.setAttribute('target', '_blank');
            var eLinkText = document.createTextNode("External Link");
            eLink.appendChild(eLinkText);
        } else {
            var link = document.createElement("a");
            link.href = `${"https://www.reddit.com" + record.data.children[i].data.permalink}`;
            link.setAttribute('target', '_blank');
            var linkText = document.createTextNode("Comments");
        }
        link.appendChild(linkText);
        if (record.data.children[i].data.is_video) {
            var video = document.createElement("video");
            video.src = `${record.data.children[i].data.secure_media.reddit_video.fallback_url}`;
            card.appendChild(video);
            video.className = "card-img-top";
            video.controls = true;
            video.muted = false;
            video.style.height = '170px';
            video.style.width = '170px';
        } else {
            var image = document.createElement("img");
            if (record.data.children[i].data.thumbnail == "self") {
                image.src = `${placeHolderImage}`;
                image.style.height = '170px';
                image.style.width = '170px';
            } else {
                image.src = `${record.data.children[i].data.thumbnail}`;
                image.style.height = '170px';
                image.style.width = '170px';
            }
            card.appendChild(image);
            image.className = "card-img-top";
        }

        var subtitle = document.createElement("div");
        var upV = document.createElement("span");
        upV.textContent = `${record.data.children[i].data.ups + "↑ "}`;
        var downV = document.createElement("span");
        downV.textContent = `${record.data.children[i].data.downs + "↓"}`;
        subtitle.appendChild(upV);
        subtitle.appendChild(downV);

        card.appendChild(content);
        content.appendChild(title);
        content.appendChild(subtitle);
        content.appendChild(paragraph);
        content.appendChild(link);
        if (eLink) {
            content.appendChild(eLink);
            eLink.className = "btn btn-primary";
        }
        document.body.appendChild(card);
        card.className = "card";
        content.className = "card-body";
        title.className = "card-title";
        subtitle.className = "card-subtitle";
        paragraph.className = "card-text";
        link.className = "btn btn-primary";
        upV.className = "text-muted";
        downV.className = "text-muted";
    }
}

fetchData();

function showLoader() {
    document.getElementsByClassName("spinner-border")[0].style.display = "inline-block";
    document.getElementById("btn").style.display = 'none';
}

function hideLoader() {
    document.getElementsByClassName("spinner-border")[0].style.display = "none";
    document.getElementById("btn").style.display = 'inline-block';
}

function clearData() {
    document.querySelectorAll('.card').forEach(e => e.remove());
}

document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('btn');

    btn.addEventListener('click', function () {
        refreshData();
    });
});

function refreshData() {
    showLoader();
    setTimeout(function () {
        fetchData();
        clearData();
        hideLoader();
    }, 1000);
}