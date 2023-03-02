


class dataGenration {
    constructor(data)
     {
        this.data = data;
    }
    encode() {
        const e = [];
        for (let key in this.data) {
            e.push(`${encodeURIComponent(key)}=${encodeURIComponent(this.data[key])}`)
        }
        return e.join('&');
    }
    setValue (key, value){
        this.data[key] = value;
        return this;
    }
    updateValue(key,value)
    {
        this.data[key] = value;
        return this.data;
    }
    
    removeKey(key)
    {
        delete this.data[key];
        return this.data;
    }
}
module.exports = dataGenration;
