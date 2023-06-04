const POST_LIMIT = 10;
const placeHolderImage = "placeholder.png";
const spoilerImage = "spoiler.png";
const nsfwImage = "nsfw.png";
var subreddit;
var filter = "new";
document.getElementById('btn-new').classList.add("btn-danger");

if (localStorage.getItem("value")) {
    subreddit = localStorage.getItem("value");
    fetchData(subreddit);
    showButtons();
    document.getElementById("subreddit").placeholder = subreddit;
}

function clearData() {
    document.querySelectorAll('.card').forEach(e => e.remove());
}

function showButtons() {
    document.getElementById('btn').style.display = 'inline-block';
    document.getElementsByClassName('filter-container')[0].style.display = '';
}

document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('subreddit-btn');
    var filterTop = document.getElementById('btn-top');
    var filterNew = document.getElementById('btn-new');
    var filterHot = document.getElementById('btn-hot');

    btn.addEventListener('click', function () {
        if (document.getElementById("subreddit").value) {
            subreddit = document.getElementById("subreddit").value;
            document.getElementById("subreddit").placeholder = subreddit;
            localStorage.setItem("value", subreddit);
            clearData();
            showLoader();
            setTimeout(function () {
                fetchData(subreddit);
                hideLoader();
                showButtons();
            }, 1000);
        }
    });

    filterTop.addEventListener('click', function () {
        clearData();
        setTimeout(function () {
            filter = "top";
            document.getElementById('btn-top').classList.add("btn-danger");
            document.getElementById('btn-new').classList.remove("btn-danger");
            document.getElementById('btn-hot').classList.remove("btn-danger");
            fetchData(subreddit);
            showButtons();
        }, 200)
    });

    filterHot.addEventListener('click', function () {
        clearData();
        setTimeout(function () {
            filter = "hot";
            document.getElementById('btn-top').classList.remove("btn-danger");
            document.getElementById('btn-new').classList.remove("btn-danger");
            document.getElementById('btn-hot').classList.add("btn-danger");
            fetchData(subreddit);
            showButtons();
        }, 200)
    });

    filterNew.addEventListener('click', function () {
        clearData();
        setTimeout(function () {
            filter = "new";
            document.getElementById('btn-top').classList.remove("btn-danger");
            document.getElementById('btn-new').classList.add("btn-danger");
            document.getElementById('btn-hot').classList.remove("btn-danger");
            fetchData(subreddit);
            showButtons();
        }, 200)
    });
});

async function fetchData(subreddit) {
    const path = "http://www.reddit.com/r/" + `${subreddit}` + "/" + `${filter}` + ".json?sort=" + `${filter}`;
    const res = await fetch(path);
    if (res.ok) {
        const record = await res.json();
        for (var i = 0; i < POST_LIMIT; i++) {
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
                var linkText = document.createTextNode("Comments" + " (" + record.data.children[i].data.num_comments + ")");

                var eLink = document.createElement("a");
                eLink.href = `${record.data.children[i].data.url}`;
                eLink.setAttribute('target', '_blank');
                var eLinkText = document.createTextNode("External Link");
                eLink.appendChild(eLinkText);
            } else {
                var link = document.createElement("a");
                link.href = `${"https://www.reddit.com" + record.data.children[i].data.permalink}`;
                link.setAttribute('target', '_blank');
                var linkText = document.createTextNode("Comments" + " (" + record.data.children[i].data.num_comments + ")");
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
                switch (record.data.children[i].data.thumbnail) {
                    case "self":
                    case "":
                    case "default":
                        image.src = `${placeHolderImage}`;
                        image.style.height = '170px';
                        image.style.width = '170px';
                        break;
                    case "spoiler":
                        image.src = `${spoilerImage}`;
                        image.style.height = '170px';
                        image.style.width = '170px';
                        break;
                    case "nsfw":
                        image.src = `${nsfwImage}`;
                        image.style.height = '170px';
                        image.style.width = '170px';
                        break;
                    default:
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
            upV.style.color = "green";
            var downV = document.createElement("span");
            downV.textContent = `${record.data.children[i].data.downs + "↓"}`;
            downV.style.color = "red";
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
                eLink.style.margin = "10px";
            }
            document.body.appendChild(card);

            card.className = "card";
            content.className = "card-body";
            title.className = "card-title";
            subtitle.className = "card-subtitle";
            paragraph.className = "card-text";
            link.className = "btn btn-primary";
        }
    } else {
        return res;
    }
}

function showLoader() {
    document.getElementsByClassName("spinner-border")[0].style.display = "inline-block";
    document.getElementById("btn").style.display = 'none';
}

function hideLoader() {
    document.getElementsByClassName("spinner-border")[0].style.display = "none";
    document.getElementById("btn").style.display = 'inline-block';
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
        fetchData(subreddit);
        clearData();
        hideLoader();
    }, 1000);
}