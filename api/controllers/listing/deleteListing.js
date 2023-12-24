import Listing from '../../models/listing.model.js';
import errorHandler from '../../utils/error.js';

const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    if (req.userId !== listing.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Listing has been deleted!',
    });
    
  } catch (error) {
    next(error);
  }
};

export default deleteListing;