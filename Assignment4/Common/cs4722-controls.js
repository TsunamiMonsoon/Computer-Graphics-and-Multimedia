


    function addSlider(area_id, id, label, min, value, max, step,
        handler = (value) => {
            console.log("handler" + value);
        })
    {
        // console.log("addslider entered");
        const display_id = id + "-value";
        const template = `<tr>
                <td>${label}</td><td> ${min}</td><td> <input id="${id}" type="range"
                min="${min}" max="${max}" step="${step}" value="${value}" />
                </td><td>${max}</td><td>
                <span id="${display_id}" class="value-display">${value}</span></td>
            </tr>  `;
        document.getElementById(area_id).insertAdjacentHTML("beforeend",
            template);
        const slider = document.getElementById(id);
        const display = document.getElementById(display_id);
        slider.addEventListener("input", (event) => {
            display.innerText = slider.value;
            handler(parseFloat(event.target.value));
        });

    }

    // addSlider_v2: function(area_id, id, label, min, value, max, step,
    //                     handler = (event) => {
    //                         console.log("handler" + event);
    //                     })
    // {
    //     const display_id = id + "-value";
    //     const template = `<tr>
    //             <td>${label}</td><td> ${min}</td><td> <input id="${id}" type="range"
    //             min="${min}" max="${max}" step="${step}" value="${value}" />
    //             </td><td>${max}</td><td>
    //             <span id="${display_id}" class="value-display">${value}</span></td>
    //         </tr>  `;
    //     document.getElementById(area_id).insertAdjacentHTML("beforeend",
    //         template);
    //     const slider = document.getElementById(id);
    //     const display = document.getElementById(display_id);
    //     slider.addEventListener("input", (event) => {
    //         display.innerText = slider.value;
    //         handler(event);
    //     });
    //
    // },
    //
    // addSlider_v1: function(area_id, id, label, min, value, max, step,
    //                     handler = (event) => {
    //                         console.log("handler" + event);
    //                     }, render = () => {})
    // {
    //     const display_id = id + "-value";
    //     const template = `<tr>
    //             <td>${label}</td><td> ${min}</td><td> <input id="${id}" type="range"
    //             min="${min}" max="${max}" step="${step}" value="${value}" />
    //             </td><td>${max}</td><td>
    //             <span id="${display_id}" class="value-display">${value}</span></td>
    //         </tr>  `;
    //     document.getElementById(area_id).insertAdjacentHTML("beforeend",
    //         template);
    //     const slider = document.getElementById(id);
    //     const display = document.getElementById(display_id);
    //     slider.addEventListener("input", (event) => {
    //         display.innerText = slider.value;
    //         handler(event);
    //         requestAnimationFrame(render);
    //     });
    //
    // },
    //
    //
    //
    // addCheckbox2: function(area_id, id, label, checked, whenChecked, whenUnchecked) {
    //     let checked_attribute = "";
    //     if (checked) {
    //         checked_attribute = "checked";
    //     }
    //     const template = `<tr>
    //         <td><input type='checkbox'
    //             id='${id}'
    //             ${checked_attribute}
    //         /></td>
    //         <td><label for="${id}">${label}</label></td>
    //         </tr>`
    //     document.getElementById(area_id).insertAdjacentHTML("beforeend",
    //         template);
    //     const cbox = document.getElementById(id);
    //     cbox.addEventListener("change", (event) => {
    //         // handler(event);
    //         // requestAnimationFrame(render);
    //         if(event.target.checked){
    //             whenChecked();
    //         } else {
    //             whenUnchecked();
    //         }
    //     });
    // },

    function addCheckbox(area_id, id, label, checked, handler) {
        let checked_attribute = "";
        if (checked) {
            checked_attribute = "checked";
        }
        const template = `<tr>
            <td><input type='checkbox'
                id='${id}'
                ${checked_attribute}
            /></td>
            <td><label for="${id}">${label}</label></td>
            </tr>`
        document.getElementById(area_id).insertAdjacentHTML("beforeend",
            template);
        const cbox = document.getElementById(id);
        cbox.addEventListener("change", (event) => {
            handler(event.target.checked);
            // requestAnimationFrame(render);
        });
    }



//     addCheckbox_v1: function(area_id, id, label, checked, handler,
//                           render = () => {}) {
//         let checked_attribute = "";
//         if (checked) {
//             checked_attribute = "checked";
//         }
//         const template = `<tr>
//             <td><input type='checkbox'
//                 id='${id}'
//                 ${checked_attribute}
//             /></td>
//             <td><label for="${id}">${label}</label></td>
//             </tr>`
//         document.getElementById(area_id).insertAdjacentHTML("beforeend",
//             template);
//         const cbox = document.getElementById(id);
//         cbox.addEventListener("change", (event) => {
//             handler(event);
//             requestAnimationFrame(render);
//         });
//     },
// };


