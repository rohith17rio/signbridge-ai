from typing import Dict, Any, List

class QualityAuditor:
    """
    Evaluates extracted landmark sequences for detection quality,
    missing hand ratios, average confidence, and continuity.
    """
    def audit_sequence(
        self,
        sequence: List[Dict[str, Any]],
        min_confidence_threshold: float = 0.6,
        max_missing_hands_ratio: float = 0.4
    ) -> Dict[str, Any]:
        if not sequence:
            return {
                "quality_status": "REJECTED",
                "reason": "Empty sequence",
                "frames_count": 0,
                "missing_hands_ratio": 1.0,
                "avg_confidence": 0.0,
                "issues": ["NO_FRAMES"]
            }

        total_frames = len(sequence)
        frames_with_hands = 0
        confidences = []
        issues = []

        for frame in sequence:
            hands = frame.get("hands", [])
            if hands:
                frames_with_hands += 1
                for hand in hands:
                    confidences.append(hand.get("confidence", 0.0))

        missing_ratio = round(1.0 - (frames_with_hands / total_frames), 3)
        avg_confidence = round(sum(confidences) / max(1, len(confidences)), 3)

        if missing_ratio > max_missing_hands_ratio:
            issues.append(f"HIGH_MISSING_HANDS_RATIO_{missing_ratio}")

        if avg_confidence < min_confidence_threshold:
            issues.append(f"LOW_AVERAGE_CONFIDENCE_{avg_confidence}")

        if total_frames < 5:
            issues.append("SHORT_SEQUENCE_LENGTH")

        if not issues:
            status = "PASSED"
            reason = "High quality sequence with clean hand detections"
        elif missing_ratio > 0.7 or avg_confidence < 0.4:
            status = "REJECTED"
            reason = "Poor detection quality or too many missing hand frames"
        else:
            status = "NEEDS_REVIEW"
            reason = "Minor quality flags detected; admin review recommended"

        return {
            "quality_status": status,
            "reason": reason,
            "total_frames": total_frames,
            "frames_with_hands": frames_with_hands,
            "missing_hands_ratio": missing_ratio,
            "avg_confidence": avg_confidence,
            "issues": issues,
        }
