(function(){

    class SocialShare extends HTMLElement {
        constructor() {
            super();
            // Elements
            this._$container = null;
            this._$buttons = null;
            this._$covers = null;
            this._$ssBar1 = null;
            this._$ssBar2 = null;
            this._$toggleBtn = null;
            // Animations
            this._buttonAnimations = null;
            this._coverAnimations = null;
            this._b1Animation = null;
            this._b2Animation = null;
            // Flags and values
            this._connected = false;
            this._isOpen = false;
            this._url = "";
            this._direction = null;
        }
        _initAnimations() {
            if (!this._connected) return;

            this._buttonAnimations = [];
            this._$buttons.forEach(($btn, idx) => {
                let y= 0;
                let x = 0;
                const value = (55 * (idx + 1));
                switch (this._direction) {
                    case "top":
                        y = value * -1;
                        break;
                    case "bottom":
                        y = value;
                        break;
                    case "right":
                        x = value;
                        break;
                    case "left":
                    default:
                        x = value * -1;
                }
                const translate = `translate(${x}px, ${y}px)`;
                const animation = $btn.animate([
                    {transform: `${translate} scale(1)`},
                    {transform: `${translate} scale(1.2)`},
                    {transform: `translate(${$btn.dataset.x}px, ${$btn.dataset.y}px) scale(0.2)`}
                ], {
                    duration: 300,
                    fill: "both",
                    easing: "cubic-bezier(0,-0.47,.77,1.07)",
                    delay: 50 * idx
                });
                animation.finish();
                this._buttonAnimations.push(animation);
            });

            if (!this._coverAnimations) {
                this._coverAnimations = [];
                this._$covers.forEach(($cover, idx) => {
                    const animation = $cover.animate([
                        { transform: "translateY(0)" },
                        { transform: "translateY(100%)" }
                    ], {
                        duration: 250,
                        fill: "both",
                        delay: 50 * idx,
                        easing: "ease-in"
                    });
                    animation.finish();
                    this._coverAnimations.push(animation);
                });
            }

            if (!this._b1Animation) {
                this._b1Animation = this._$ssBar1.animate([
                    {transform: "rotate(45deg) translate(25px, 8px)"},
                    {transform: "rotate(-45deg) translate(-8px, 10px)"}
                ], {
                    duration: 150,
                    fill: "both"
                });
                this._b1Animation.finish();
            }

            if (!this._b2Animation) {
                this._b2Animation = this._$ssBar2.animate([
                    {transform: "rotate(-45deg) translate(-8px, 25px)"},
                    {transform: "rotate(-45deg) translate(-5px, 37px)"}
                ], {
                    duration: 150,
                    fill: "both"
                });
                this._b2Animation.finish();
            }

        }
        connectedCallback() {
            this.innerHTML = `
                <div class="ss-container">
                    <button class="ss-toggle-btn" id="ssToggleBtn"></button> 
                    <a class="ss-share-btn ss-twitter" data-x="0" data-y="0" data-url="https://twitter.com/intent/tweet?url=">
                        <div class="ss-cover">
                            <span class="icon-twitter"></span>
                        </div>
                    </a>    
                    <a class="ss-share-btn ss-facebook" data-x="11" data-y="-11.5" data-url="https://www.facebook.com/sharer/sharer.php?u=">
                        <div class="ss-cover">
                            <span class="icon-facebook2"></span>
                        </div>
                    </a> 
                    <a class="ss-share-btn ss-google" data-x="-12" data-y="11" data-url="https://plus.google.com/share?url=">
                        <div class="ss-cover">
                            <span class="icon-google-plus2"></span>
                        </div>
                    </a>       
                    <div class="ss-bar" id="ssBar1"></div>
                    <div class="ss-bar" id="ssBar2"></div>
                </div>
            `;
            this._url = this.getAttribute("url");
            this._direction = this.getAttribute("direction");
            this._$container = this.querySelector(".ss-container");
            this._$buttons = this.querySelectorAll(".ss-share-btn");
            this._$buttons.forEach($btn => $btn.addEventListener("click", () => {
                if (!this._url) {
                    console.error("The URL to share has not been provided.");
                    return;
                }
                window.open(
                    $btn.dataset.url + encodeURIComponent(this._url),
                    "share-popup",
                    "width=400,height=436"
                );
            }));
            this._$covers = this.querySelectorAll(".ss-cover");
            this._$ssBar1 = this.querySelector("#ssBar1");
            this._$ssBar2 = this.querySelector("#ssBar2");
            this._$toggleBtn = this.querySelector("#ssToggleBtn");
            this._$toggleBtn.addEventListener("click", () => {
                if (this._isOpen === true) {
                    this._close();
                } else {
                    this._open();
                }
            });

            this._connected = true;
            this._initAnimations();
        }
        _open() {
            if (this._isOpen === true || !this._buttonAnimations) return;
            this._isOpen = true;
            this._$container.classList.add("ss-open");
            this._buttonAnimations.forEach(animation => animation.reverse());
            this._coverAnimations.forEach(animation => animation.reverse());
            this._b1Animation.reverse();
            this._b2Animation.reverse();
        }
        _close() {
            if (this._isOpen === false || !this._buttonAnimations) return;
            this._isOpen = false;
            this._$container.classList.remove("ss-open");
            this._buttonAnimations.forEach(animation => animation.reverse());
            this._coverAnimations.forEach(animation => animation.reverse());
            this._b1Animation.reverse();
            this._b2Animation.reverse();
        }
        static get observedAttributes() {
            return ["direction", "url"];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                switch (name) {
                    case "direction":
                        if (this._direction !== newValue && ["left", "right", "top", "bottom"].includes(newValue)) {
                            this._direction = newValue;
                            this._initAnimations();
                        }
                        break;
                    case "url":
                        this._url = newValue;
                        break;
                }
            }
        }
    }
    customElements.define("social-share", SocialShare);

})();