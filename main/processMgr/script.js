const { ipcRenderer } = require('electron');

let totalMemory, processArr;

ipcRenderer.on('available-memory', (e, RAM) => {
    totalMemory = RAM;
})


/**
 * 
 * @param {Number} id 
 * @param {String} name 
 * @param {String} type 
 * @param {Number} cpu 
 * @param {Number} memory 
 * @returns {String}
 */
const template = (id, name, type, cpu, memory) => {
    return `<tr class='process'>
    <td class="pid">${id}</td>
    <td class="name">${name}</td>
    <td class="type">${type}</td>
    <td class='meter'>
        ${cpu.toFixed(2)}% <meter class="cpu" low="33" high="66" min="0" max="100" optimum="80" value=${cpu}></meter>
    </td>
    <td class='meter'>
        ${(memory / 1024).toFixed(2)}Mb <meter class="memory" low="33" high="66" min="0" max="100" optimum="80" value=${memory * 100 / totalMemory}></meter>
    </td>
</tr>`
}


function updateDOM() {

    document.getElementById('process-container').innerHTML = '<tr class="process head"><td>Id</td><td>Name</td><td>Type</td><td>CPU</td><td>Memory</td></tr>';

    for (var i = 0, len = processArr.length; i < len; i++) {

        var p = processArr[i],
            name = p.name == undefined ? (p.serviceName == undefined ? '-' : p.serviceName) : p.name;

        document.getElementById('process-container').insertAdjacentHTML(
            'beforeend',
            template(
                p.pid,
                name,
                p.type,
                p.cpu.percentCPUUsage,
                p.memory.workingSetSize
            )
        )

    }

}


ipcRenderer.on('process-info', (e, processInfo) => {

    processArr = processInfo;

    updateDOM();

})