
_ = lodash

export function findBed(bedid){
    return Rooms.findOne({"beds.id": bedid, "beds.patient": null}).beds.filter(x => x.id === bedid)[0]
}