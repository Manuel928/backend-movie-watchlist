import { prisma } from "../config/db.js";

const addToWatchList = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  // verify movie exists
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({
      error: "Movie not found",
    });
  }

  //   check if already existing
  const existingInWatchlist = await prisma.watchListItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (existingInWatchlist) {
    return res.status(400).json({
      error: "Movie already in the watchlist",
    });
  }

  const watchListItem = await prisma.watchListItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

  res.status(201).json({
    status: "successs",
    data: watchListItem,
  });
};

// Update watchlist item
const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;

  const watchListItem = await prisma.watchListItem.findUnique({
    where: { id: req.params.id },
  });

  // check if the item exists
  if (!watchListItem) {
    return res.status(404).json({
      error: "Watchlist item not found",
    });
  }

  // ensure the correct user is able to delete the watchlist item
  if (watchListItem.userId !== req.user.id) {
    return res.status(403).json({
      error: "Not allowed to update this watchlist item!",
    });
  }

  const updateData = {};
  if (status !== undefined) updateData.status = status.toUpperCase();
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

  const updatedItem = await prisma.watchListItem.update({
    where: { id: req.params.id },
    data: updateData,
  });

  res.status(200).json({
    status: "success",
    data: {
      watchListItem: updatedItem,
    },
  });
};

// Remove from watchlist
const removeFromWatchList = async (req, res) => {
  const watchlistItem = await prisma.watchListItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchlistItem) {
    return res.status(404).json({
      error: "Watchlist item not found",
    });
  }

  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({
      error: "Not allowed to update this watchlist item!",
    });
  }

  await prisma.watchListItem.delete({
    where: { id: req.params.id },
  });

  res.status(200).json({
    status: "successs",
    message: "Movie deleted fom watchlist successfully",
  });
};

export { addToWatchList, updateWatchlistItem, removeFromWatchList };
