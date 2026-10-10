
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  if (!form) return;

  const nameInput = document.getElementById("customerName");
  const emailInput = document.getElementById("customerEmail");
  const phoneInput = document.getElementById("customerPhone");
  const serviceInput = document.getElementById("serviceRequired");
  const dateInput = document.getElementById("projectDate");
  const detailsInput = document.getElementById("projectDetails");
  const feedback = document.getElementById("formFeedback");

  const studioEmail = "snapupstudio.in@gmail.com";

  const serviceNames = {
    "wedding-photography": "Wedding Photography",
    "cinematic-films": "Cinematic Wedding Films",
    events: "Events and Celebrations",
    portraits: "Portrait Photography",
    commercial: "Commercial Photography",
    fashion: "Fashion and Editorial Photography"
  };

  // Prevent selecting a past project date.
  if (dateInput) {
    const now = new Date();
    const localToday = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = localToday;
  }

  // Preselect the service when someone arrives from the Services page.
  const requestedService = new URLSearchParams(
    window.location.search
  ).get("service");

  if (requestedService && serviceNames[requestedService] && serviceInput) {
    const matchingOption = Array.from(serviceInput.options).find(
      (option) =>
        option.value === requestedService ||
        option.textContent.trim() === serviceNames[requestedService]
    );

    if (matchingOption) {
      serviceInput.value = matchingOption.value;
    }
  }

  function validateTrimmedField(input, message, minimumLength = 1) {
    if (!input) return true;

    const value = input.value.trim();

    if (value.length < minimumLength) {
      input.setCustomValidity(message);
      return false;
    }

    input.setCustomValidity("");
    return true;
  }

  function validateFormText() {
    const nameValid = validateTrimmedField(
      nameInput,
      "Please enter your name."
    );

    const detailsValid = validateTrimmedField(
      detailsInput,
      "Please enter at least 10 characters describing your project.",
      10
    );

    return nameValid && detailsValid;
  }

  function clearFeedback() {
    if (!feedback) return;

    feedback.textContent = "";
    feedback.className = "form-feedback";
    feedback.removeAttribute("role");
    feedback.removeAttribute("aria-live");
  }

  function showFeedback(message, emailUrl) {
    if (!feedback) return;

    feedback.replaceChildren();
    feedback.className = "form-feedback is-visible";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");

    const messageText = document.createElement("p");
    messageText.textContent = message;
    feedback.appendChild(messageText);

    if (emailUrl) {
      const emailLink = document.createElement("a");
      emailLink.className = "prepared-email-link";
      emailLink.href = emailUrl;
      emailLink.textContent = "Open your email app to send the inquiry";
      feedback.appendChild(emailLink);

      const note = document.createElement("p");
      note.className = "form-feedback-note";
      note.textContent =
        "Your email app will open with the details filled in. Review the message and press Send to contact SnapUp Studios.";
      feedback.appendChild(note);
    }

    feedback.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "nearest"
    });
  }

  [nameInput, detailsInput].forEach((input) => {
    if (!input) return;

    input.addEventListener("input", () => {
      validateFormText();
      clearFeedback();
    });
  });

  form.addEventListener("input", clearFeedback);
  form.addEventListener("change", clearFeedback);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    validateFormText();

    if (!form.reportValidity()) {
      return;
    }

    const customerName = nameInput.value.trim();
    const customerEmail = emailInput.value.trim();
    const customerPhone = phoneInput ? phoneInput.value.trim() : "";
    const selectedOption = serviceInput.options[serviceInput.selectedIndex];
    const serviceName = selectedOption
      ? selectedOption.textContent.trim()
      : "Not specified";
    const projectDate = dateInput ? dateInput.value : "";
    const projectDetails = detailsInput.value.trim();

    const formattedDate = projectDate
      ? new Date(`${projectDate}T12:00:00`).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })
      : "Flexible / not decided";

    const subject = `Photography inquiry — ${serviceName}`;

    const body = [
      "Hello SnapUp Studios,",
      "",
      "I would like to enquire about your services.",
      "",
      `Name: ${customerName}`,
      `Email: ${customerEmail}`,
      `Phone: ${customerPhone || "Not provided"}`,
      `Service: ${serviceName}`,
      `Preferred date: ${formattedDate}`,
      "",
      "Project details:",
      projectDetails,
      "",
      "Thank you."
    ].join("\n");

    const emailUrl =
      `mailto:${studioEmail}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    showFeedback(
      "Your inquiry has been prepared. It has not been sent yet.",
      emailUrl
    );
  });
});
