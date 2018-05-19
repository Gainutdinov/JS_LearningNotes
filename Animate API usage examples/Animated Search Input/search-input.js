(function() {

    const timing = {
        duration: 250,
        fill: "both",
        easing: "ease-out"
    };

    const handle2Keyframes = [
        { transform: "rotate(0)"},
        { transform: "rotate(89deg)"}
    ];

    const inputKeyframes = [
        { transform: "translateX( calc(100% - 25px) )"},
        { transform: "translateX(25px)"}
    ];

    const handlesKeyframes = [
        { transform: "translate(0,0) rotate(44deg)"},
        { transform: "translate(-20px,-20px) rotate(44deg)"}
    ];
    
    class SearchInput extends HTMLElement {
    
        constructor() {
            super();
            this._$input = null;
            this._$container = null;
            this._$handles = null;
            this._$handle2 = null;
            this._$openBtn = null
            this._isOpen = false;
            this._value = false;
        }
    
        connectedCallback() {
            this.innerHTML = `
                <div class="si-container">
                    <div class="si-input-frame">
                        <input type="text" id="siInput" />
                    </div>
                    <div class="si-right-half-circle"></div>
                    <button id="siOpenBtn"></button>
                    <div id="siHandles">
                        <div id="siHandle1" class="si-handle"></div>
                        <div id="siHandle2" class="si-handle"></div>
                    </div>
                </div>
            `;
            this._$input = this.querySelector("#siInput");
            this._$input.addEventListener("keyup", () => {
                this._value = this._$input.value;
                this.dispatchEvent(new CustomEvent("term-changed", {
                    detail: this._value
                }))
            });
            this._$input.addEventListener("keydown", e => {
                if (e.keyCode === 13) {// Enter key
                    this._value = this._$input.value;
                    this.dispatchEvent(new CustomEvent("term-submitted", {
                        detail: this._value
                    }))
                }
            });
            this._$container = this.querySelector(".si-container");
            this._$handles = this.querySelector("#siHandles");
            this._$handle2 = this.querySelector("#siHandle2");
            this._$openBtn = this.querySelector("#siOpenBtn");
            this._$openBtn.addEventListener("click", () => {
                if (this._isOpen === true) return;
                this._open();
            });
            this._$handles.addEventListener("click", () => {
                if (this._isOpen === false) return;
                this._close();
            });
            
        }
    
        _open() {
            this._isOpen = true;
            this._$container.classList.add("open");
            this._$input.animate(inputKeyframes, timing).onfinish = () => {
                this._$input.focus();
            };
            const handlesT = Object.assign({}, timing, {
                duration: 100
            })
            this._$handles.animate(handlesKeyframes, handlesT).onfinish = () => {
                const handle2T = Object.assign({}, timing, {easing: "cubic-bezier(.77, -0.62, .67, 1.89)"});
                this._$handle2.animate(handle2Keyframes, handle2T)
            };
        }
    
        _close() {
            this._isOpen = false;
            this._$container.classList.remove("open");
            this._$input.blur();
            this._$input.value = "";
            this._$input.animate(inputKeyframes, timing).reverse();
            const handle2T = Object.assign({}, timing, {
               duration: 100 
            });
            const handle2 = this._$handle2.animate(handle2Keyframes, handle2T);
            handle2.onfinish = () => {
                this._$handles.animate(handlesKeyframes, timing).reverse();
            };
            handle2.reverse();
        }

        get value() {
            return this._value;
        }
    
    }

    
    customElements.define("search-input", SearchInput);
}())


