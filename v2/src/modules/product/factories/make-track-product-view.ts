import { MongooseProductRepository, TrackProductView } from "../index.js";

export function makeTrackProductView() {
    const mongooseProductRepository = new MongooseProductRepository();
    const trackProductView = new TrackProductView(mongooseProductRepository);
    return trackProductView;
}
