/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { v4 as uuidv4 } from "uuid";

const issueForm = document.querySelector("#issue-form") as HTMLFormElement;
const issuesSection = document.querySelector(".issues-section") as HTMLDivElement;
let closeBtn: HTMLButtonElement;

type Issue = {
    id: string;
    description: string;
    severity: string;
    assigned: string;
};

const issues: Issue[] = JSON.parse(localStorage.getItem("issues") || "");

const issueTemplate = (issue: Issue) => {
    return `<div class="container">
                <div class="flex">
                    <h2>${issue.description}</h2>
                    <span id="id">Issue ID: <i>${issue.id}</i></span>
                    <div class="flex-row">
                        <span class="severity ${issue.severity.toLocaleLowerCase()}">${issue.severity}</span>
                        <span>${issue.assigned}</span>
                    </div>
                </div>
                <div class="flex-row">
                    <button class="delete" type="button">Delete</button>
                </div>
            </div>`;
};

const renderIssues = () => {
    issues.forEach((issue) => issuesSection.insertAdjacentHTML("afterbegin", issueTemplate(issue)));
};

const createIssue = (e: Event) => {
    e.preventDefault();
    if (
        issueForm.querySelector<HTMLInputElement>("#issue-desc")!.value.trim() === "" ||
        issueForm.querySelector<HTMLSelectElement>("#issue-security")!.value.trim() === "" ||
        issueForm.querySelector<HTMLInputElement>("#issue-assigned")!.value.trim() === ""
    ) {
        return;
    }
    const issue = {
        id: uuidv4(),
        description: issueForm.querySelector<HTMLInputElement>("#issue-desc")!.value,
        severity: issueForm.querySelector<HTMLSelectElement>("#issue-security")!.value,
        assigned: issueForm.querySelector<HTMLInputElement>("#issue-assigned")!.value,
    };
    issues.push(issue);
    localStorage.setItem("issues", JSON.stringify(issues));
    issuesSection.insertAdjacentHTML("afterbegin", issueTemplate(issue));
};

const deleteIssue = (e: Event) => {
    const target = e.target as Element;
    const id = target!.parentNode!.parentNode!.querySelector<HTMLSpanElement>("#id i")!.innerText;
    const updatedIssues = issues.filter((issue) => issue.id !== id);
    localStorage.setItem("issues", JSON.stringify(updatedIssues));
    if (issues.findIndex((issue) => issue.id === id) > -1) {
        issues.splice(
            issues.findIndex((issue) => issue.id === id),
            1
        );
    }
    issuesSection.innerHTML = "";
    renderIssues();
};

issueForm.addEventListener("submit", createIssue);

document.addEventListener("DOMNodeInserted", () => {
    closeBtn = document.querySelector(".delete") as HTMLButtonElement;
    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => deleteIssue(e));
    }
});

renderIssues();
