import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

actor {
  type ScoreEntry = {
    principal : Principal;
    score : Nat;
  };

  module ScoreEntry {
    public func compare(a : ScoreEntry, b : ScoreEntry) : Order.Order {
      Nat.compare(b.score, a.score);
    };
  };

  let scores = Map.empty<Principal, Nat>();

  public shared ({ caller }) func submitScore(score : Nat) : async () {
    if (score <= 0) { return };
    switch (scores.get(caller)) {
      case (null) { scores.add(caller, score) };
      case (?currentScore) {
        if (score > currentScore) {
          scores.add(caller, score);
        };
      };
    };
  };

  public query ({ caller }) func getTopScores(limit : Nat) : async [ScoreEntry] {
    let scoreEntries = List.empty<ScoreEntry>();
    scores.entries().forEach(func((principal, score)) { scoreEntries.add({ principal; score }) });
    let sortedScores = scoreEntries.sort();
    sortedScores.sliceToArray(0, limit);
  };
};
