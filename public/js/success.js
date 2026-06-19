const params =
    new URLSearchParams(
        window.location.search
    );

const file =
    params.get("file");

const downloadLink =
    document.getElementById(
        "downloadLink"
    );

downloadLink.href =
    `/downloads/${file}`;

