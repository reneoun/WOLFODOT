const LOCAL_STORAGE_KEY = 'markdown-editor';
const firstMessange = `# Your Fantasie is the limit 🚀
> Dreams stay dreams when you don't plan them !
 - [ ] Write your first goal`;
const mdPreview = document.getElementById('md-preview');
const mainInput = document.getElementById('main-input');

const mdInput = document.getElementById('md-input');
const editor = new mdEditor({
    element: mdInput,
});
let currentMarkdown = localStorage.getItem(LOCAL_STORAGE_KEY) || firstMessange;
if (currentMarkdown) {
    const zeroMdElement = document.createElement('zero-md');
    const newMdFile = new File([currentMarkdown], 'new.md', {type: 'text/markdown'});
    zeroMdElement.setAttribute('src', URL.createObjectURL(newMdFile));
    appendNewZeroMdElement(zeroMdElement);
 
    editor.value(currentMarkdown);
}

 
window.addEventListener("keydown", (event) => {
    // if crtl + enter is pressed'
    if (event.ctrlKey && event.key === 'Enter') {
        console.log('ctrl + enter pressed', currentMarkdown);
        currentMarkdown = editor.value();
        localStorage.setItem(LOCAL_STORAGE_KEY, currentMarkdown);
        console.log(currentMarkdown.split('\n'));
        const zeroMdElement = document.createElement('zero-md');
        const newMdFile = new File([currentMarkdown], 'new.md', {type: 'text/markdown'});
        zeroMdElement.setAttribute('src', URL.createObjectURL(newMdFile));
        if (mdPreview.firstChild) {
            mdPreview.removeChild(mdPreview.firstChild);
        }
        appendNewZeroMdElement(zeroMdElement);
    }
});

// mdInput.addEventListener('input', (event) => {
//     currentMarkdown = event.target.value;
//     console.log(currentMarkdown);
// });

// mdInput.addEventListener('keydown', (event) => {
//     // if crtl + enter is pressed'
//     if (event.ctrlKey && event.key === 'Enter') {
//         console.log('ctrl + enter pressed', currentMarkdown);
//         localStorage.setItem(LOCAL_STORAGE_KEY, currentMarkdown);
//         console.log(currentMarkdown.split('\n'));
//         const zeroMdElement = document.createElement('zero-md');
//         const newMdFile = new File([currentMarkdown], 'new.md', {type: 'text/markdown'});
//         zeroMdElement.setAttribute('src', URL.createObjectURL(newMdFile));
//         if (mdPreview.firstChild) {
//             mdPreview.removeChild(mdPreview.firstChild);
//         }
//         appendNewZeroMdElement(zeroMdElement);
//     }
// });

async function appendNewZeroMdElement(zeroMdElement) {
    mdPreview.appendChild(zeroMdElement);
    setTimeout(() => {
        zeroMdElement.shadowRoot.querySelector('.markdown-body').style = 'background-color: transparent;';
        makeCheckboxesClickable();
    }, 500);
}

function makeCheckboxesClickable() {
    const zeroMdElement = document.querySelector('zero-md').shadowRoot;
    const checkboxes = zeroMdElement.querySelectorAll('input[type="checkbox"]');
    const li_with_checkbox = zeroMdElement.querySelectorAll('li:has(input[type="checkbox"])');

    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        checkbox.id = `checkbox-${i}`;
        checkbox.style.cursor = 'pointer';
        checkbox.disabled = false;
        checkbox.parentElement.style = 'list-style-type: none;'
        if (checkbox.checked) {
            checkbox.parentElement.style.textDecoration = 'line-through';
        }
        checkbox.addEventListener('click', (event) => {
            checkboxFunctionality(checkbox, checkbox.parentElement, i);
        });
    }
    for (let i = 0; i < li_with_checkbox.length; i++) {
        const li = li_with_checkbox[i];
        li.style.cursor = 'pointer';
        li.addEventListener('click', (event) => {
            const checkbox = event.target.querySelector('input[type="checkbox"]');
            if (!checkbox) {
                return;
            }
            checkbox.checked = !checkbox.checked;
            checkboxFunctionality(checkbox, li, i);
        });
    }
}

function checkboxFunctionality(checkbox, li, i) {
    const checked = checkbox.checked;
    if (checked) {
        li.style.textDecoration = 'line-through';
    } else {
        li.style.textDecoration = 'none';
    }
    currentMarkdown.split('\n')
        .filter((line1) => line1.includes(' - [ ]') || line1.includes(' - [x]'))
        .forEach((line1, index) => {
            if (index === i) {
                currentMarkdown = currentMarkdown.replace(line1, `${checked ? ' - [x]' : ' - [ ]'} ${line1.split('] ')[1]}`);
                editor.value(currentMarkdown);
                console.log(currentMarkdown);
                localStorage.setItem(LOCAL_STORAGE_KEY, currentMarkdown);
            }
        });
}

